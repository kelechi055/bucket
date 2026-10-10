import { activityAction, activityEnabled } from "./collaboration-activity";
import { collection, addDoc, getDocs, doc, updateDoc, getDocFromServer, setDoc, onSnapshot, query, where, arrayUnion, runTransaction, writeBatch, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { signInWithCustomToken } from "firebase/auth";
import { auth, db } from "../../firebase";
import { publicSnapshot, validateTrip, orderedStopIndices, customStop } from "./list-planning";

export async function connectUser(userId, getToken) {
  if (!userId) throw new Error("Sign in to access your saved lists.");
  await auth.authStateReady();
  if (auth.currentUser?.uid === userId) return;

  let token;
  const template = process.env.NEXT_PUBLIC_CLERK_FIREBASE_TEMPLATE;
  if (template) {
    token = await getToken({ template });
  } else {
    const response = await fetch("/api/firebase-token", { method: "POST" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to connect your account.");
    token = data.token;
  }
  if (!token) throw new Error("Unable to connect your account.");
  const credentials = await signInWithCustomToken(auth, token);
  if (credentials.user.uid !== userId) {
    await auth.signOut();
    throw new Error("Your saved-list account does not match your sign-in. Please contact support.");
  }
}

export async function saveBucketList(userId, getToken, userInfo, bucketItems, metadata = {}) {
  await connectUser(userId, getToken);
  return addDoc(collection(db, "users", userId, "savedBucketLists"), {
    userInfo,
    bucketItems,
    timestamp: new Date().toISOString(),
    title: metadata.title || "",
    sourceGuideId: metadata.sourceGuideId || "",
  });
}

export async function loadBucketLists(userId, getToken) {
  await connectUser(userId, getToken);
  const snapshot = await getDocs(collection(db, "users", userId, "savedBucketLists"));
  return snapshot.docs
    .map((doc) => ({ ...doc.data(), id: doc.id }))
    .sort((a, b) => dateMillis(b.timestamp) - dateMillis(a.timestamp));
}

export async function deleteBucketList(userId, getToken, listId) {
  await connectUser(userId, getToken);
  const ref = doc(db, "users", userId, "savedBucketLists", listId);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists()) return;
    if (snapshot.data().shareId) transaction.delete(doc(db, "sharedLists", snapshot.data().shareId));
    transaction.delete(ref);
  });
}

export async function renameBucketList(userId, getToken, listId, title) {
  const trimmed = title.trim();
  if (!trimmed || trimmed.length > 100) throw new Error("Use a list name between 1 and 100 characters.");
  await connectUser(userId, getToken);
  await updateDoc(doc(db, "users", userId, "savedBucketLists", listId), { title: trimmed });
  return trimmed;
}

export async function setActivityComplete(userId, getToken, listId, index, completed) {
  if (!Number.isInteger(index) || index < 0) throw new Error("Invalid activity.");
  await connectUser(userId, getToken);
  await updateDoc(doc(db, "users", userId, "savedBucketLists", listId), {
    [`completedItems.${index}`]: Boolean(completed),
  });
}

export function dateMillis(value) {
  const millis = value?.toMillis ? value.toMillis() : new Date(value).getTime();
  return Number.isFinite(millis) ? millis : 0;
}

export async function saveActivityNote(userId, getToken, listId, index, note) {
  if (!Number.isInteger(index) || index < 0 || typeof note !== "string" || note.length > 2000) throw new Error("Notes must be 2,000 characters or less.");
  await connectUser(userId, getToken);
  await updateDoc(doc(db, "users", userId, "savedBucketLists", listId), { [`notes.${index}`]: note.trim() });
  return note.trim();
}

export async function saveTripPlan(userId, getToken, listId, trip, assignments) {
  const dates = validateTrip(trip, assignments);
  await connectUser(userId, getToken);
  await updateDoc(doc(db, "users", userId, "savedBucketLists", listId), { trip: dates, scheduledItems: assignments });
  return dates;
}

export async function publishList(userId, getToken, list) {
  await connectUser(userId, getToken);
  const ref = planReference(userId, list);
  const candidateId = doc(collection(db, "sharedLists")).id;
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists()) throw new Error("This list no longer exists.");
    const data = snapshot.data();
    if (list.teamId && data.ownerId !== userId) throw new Error("Only the owner can publish this plan.");
    const shareId = data.shareId || candidateId;
    transaction.update(ref, { shareId });
    addActivity(transaction, list, userId, "shared");
    transaction.set(doc(db, "sharedLists", shareId), {
      ...publicSnapshot(data), ownerId: userId, sourceListId: list.teamId || list.id, sourceType: list.teamId ? "team" : "private", updatedAt: new Date().toISOString(),
    });
    return shareId;
  });
}

export async function revokeListShare(userId, getToken, list) {
  await connectUser(userId, getToken);
  const ref = planReference(userId, list);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists()) throw new Error("This list no longer exists.");
    const shareId = snapshot.data().shareId;
    transaction.update(ref, { shareId: "" });
    addActivity(transaction, list, userId, "shared");
    if (shareId) transaction.delete(doc(db, "sharedLists", shareId));
  });
}

export async function loadSharedList(shareId) {
  if (!/^[A-Za-z0-9]{20}$/.test(shareId)) return null;
  const snapshot = await getDocFromServer(doc(db, "sharedLists", shareId));
  return snapshot.exists() ? publicSnapshot(snapshot.data()) : null;
}

export function planReference(userId, list) {
  return list.teamId ? doc(db, "collaborativeLists", list.teamId) : doc(db, "users", userId, "savedBucketLists", list.id);
}

export async function updatePlan(userId, getToken, list, update) {
  await connectUser(userId, getToken);
  const batch = writeBatch(db);
  batch.update(planReference(userId, list), update);
  addActivity(batch, list, userId, activityAction(update));
  await batch.commit();
}

export async function updatePersonalList(userId, getToken, list, update) {
  await connectUser(userId, getToken);
  if (list.teamId) await setDoc(doc(db, "users", userId, "teamListPreferences", list.teamId), update, { merge: true });
  else await updateDoc(planReference(userId, list), update);
}

export async function addCustomStop(userId, getToken, list, draft) {
  const item = customStop(draft, list.destination || list.userInfo?.location || "");
  await connectUser(userId, getToken);
  return runTransaction(db, async (transaction) => {
    const ref = planReference(userId, list);
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists()) throw new Error("This list no longer exists.");
    const data = snapshot.data(), items = data.bucketItems || [];
    if (items.length >= 100) throw new Error("This list already has 100 stops. Create another list to add more.");
    const update = { bucketItems: [...items, item], stopOrder: [...orderedStopIndices(data), items.length] };
    transaction.update(ref, update);
    addActivity(transaction, list, userId, activityAction(update));
    return update;
  });
}

export async function reorderStops(userId, getToken, list, order) {
  await connectUser(userId, getToken);
  await runTransaction(db, async (transaction) => {
    const ref = planReference(userId, list);
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists()) throw new Error("This list no longer exists.");
    const current = snapshot.data();
    if (order.length !== current.bucketItems.length || new Set(order).size !== order.length || order.some((i) => !Number.isInteger(i) || i < 0 || i >= order.length)) {
      throw new Error("The stops changed while you were reordering. Try again with the updated list.");
    }
    transaction.update(ref, { stopOrder: order });
    addActivity(transaction, list, userId, "reordered");
  });
}

export async function createCollaborativeList(userId, getToken, list) {
  await connectUser(userId, getToken);
  if (list.teamId) return list.teamId;
  const ref = doc(collection(db, "collaborativeLists"));
  const sourceRef = planReference(userId, list);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sourceRef);
    if (!snapshot.exists()) throw new Error("This list no longer exists.");
    const source = snapshot.data();
    transaction.set(ref, {
      ...publicSnapshot(source), ownerId: userId, memberIds: [userId],
      // Keep the original stop indices, including those used by personal notes.
      bucketItems: source.bucketItems || [], stopOrder: orderedStopIndices(source),
      trip: source.trip || { start: "", end: "" }, scheduledItems: source.scheduledItems || {}, completedItems: source.completedItems || {},
      budget: source.budget || { limitCents: 0, costs: {} }, destination: source.userInfo?.location || "", timestamp: new Date().toISOString(), inviteId: "", shareId: "",
    });
    addActivity(transaction, { teamId: ref.id }, userId, "created");
    transaction.set(doc(db, "users", userId, "teamListPreferences", ref.id), { notes: source.notes || {}, favorite: Boolean(source.favorite), favoriteItems: source.favoriteItems || {} });
  });
  return ref.id;
}

export async function watchCollaborativeLists(userId, getToken, onChange, onError) {
  await connectUser(userId, getToken);
  let personal = {}, plans = [], preferencesReady = false, plansReady = false;
  const emit = () => { if (preferencesReady && plansReady) onChange(plans.map((entry) => ({ ...entry, ...(personal[entry.teamId] || {}) }))); };
  const stopPreferences = onSnapshot(collection(db, "users", userId, "teamListPreferences"), (snapshot) => {
    personal = Object.fromEntries(snapshot.docs.map((entry) => [entry.id, entry.data()]));
    preferencesReady = true; emit();
  }, onError);
  const stopPlans = onSnapshot(query(collection(db, "collaborativeLists"), where("memberIds", "array-contains", userId)), (snapshot) => {
    plans = snapshot.docs.map((entry) => ({ ...entry.data(), id: `team:${entry.id}`, teamId: entry.id }));
    plansReady = true; emit();
  }, onError);
  return () => { stopPreferences(); stopPlans(); };
}

export async function createInvite(userId, getToken, list) {
  await connectUser(userId, getToken);
  const newId = doc(collection(db, "listInvites")).id;
  await runTransaction(db, async (transaction) => {
    const ref = planReference(userId, list), snapshot = await transaction.get(ref);
    if (!snapshot.exists()) throw new Error("This plan no longer exists.");
    const data = snapshot.data();
    if (data.ownerId !== userId) throw new Error("Only the owner can invite collaborators.");
    if (data.inviteId) transaction.delete(doc(db, "listInvites", data.inviteId));
    transaction.update(ref, { inviteId: newId });
    addActivity(transaction, list, userId, "invited");
    transaction.set(doc(db, "listInvites", newId), { teamId: list.teamId, ownerId: userId, title: data.title || "Shared adventure" });
  });
  return newId;
}

export async function disableInvite(userId, getToken, list) {
  await connectUser(userId, getToken);
  await runTransaction(db, async (transaction) => {
    const ref = planReference(userId, list), snapshot = await transaction.get(ref);
    if (!snapshot.exists()) throw new Error("This plan no longer exists.");
    if (snapshot.data().inviteId) transaction.delete(doc(db, "listInvites", snapshot.data().inviteId));
    transaction.update(ref, { inviteId: "" });
    addActivity(transaction, list, userId, "invitation");
  });
}

export async function loadInvite(userId, getToken, inviteId) {
  if (!/^[A-Za-z0-9]{20}$/.test(inviteId)) return null;
  await connectUser(userId, getToken);
  const snapshot = await getDocFromServer(doc(db, "listInvites", inviteId));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function joinCollaborativeList(userId, getToken, inviteId) {
  const invite = await loadInvite(userId, getToken, inviteId);
  if (!invite) throw new Error("This invitation is unavailable.");
  const batch = writeBatch(db);
  batch.update(doc(db, "collaborativeLists", invite.teamId), { memberIds: arrayUnion(userId), joinToken: inviteId });
  addActivity(batch, { teamId: invite.teamId }, userId, "joined");
  await batch.commit();
  return invite.teamId;
}

export async function removeCollaborator(userId, getToken, list, memberId) {
  await connectUser(userId, getToken);
  await runTransaction(db, async (transaction) => {
    const ref = planReference(userId, list), snapshot = await transaction.get(ref);
    if (!snapshot.exists()) throw new Error("This plan no longer exists.");
    const data = snapshot.data();
    if (memberId === data.ownerId) throw new Error("The owner cannot leave the shared plan.");
    const update = { memberIds: data.memberIds.filter((id) => id !== memberId) };
    if (data.ownerId === userId && memberId !== userId && data.inviteId) {
      transaction.delete(doc(db, "listInvites", data.inviteId));
      update.inviteId = "";
    }
    transaction.update(ref, update);
    addActivity(transaction, list, userId, "members");
  });
}

export async function deleteCollaborativeList(userId, getToken, list) {
  await connectUser(userId, getToken);
  await runTransaction(db, async (transaction) => {
    const ref = planReference(userId, list), snapshot = await transaction.get(ref);
    if (!snapshot.exists()) return;
    const data = snapshot.data();
    if (data.shareId) transaction.delete(doc(db, "sharedLists", data.shareId));
    if (data.inviteId) transaction.delete(doc(db, "listInvites", data.inviteId));
    transaction.delete(ref);
  });
}

export async function appendEvent(userId, getToken, list, item) {
  await connectUser(userId, getToken);
  return runTransaction(db, async (transaction) => {
    const ref = planReference(userId, list), snapshot = await transaction.get(ref);
    if (!snapshot.exists() || snapshot.data().deletedAt) throw new Error("This list is unavailable.");
    const data = snapshot.data(), items = data.bucketItems || [];
    if (items.some((stop) => stop.website && stop.website === item.website)) throw new Error("This event is already in the list.");
    if (items.length >= 100) throw new Error("This list already has 100 stops.");
    const update = { bucketItems: [...items, item], stopOrder: [...orderedStopIndices(data), items.length] };
    transaction.update(ref, update);
    addActivity(transaction, list, userId, activityAction(update)); return update;
  });
}

export async function trashList(userId, getToken, list) {
  await connectUser(userId, getToken);
  await runTransaction(db, async (transaction) => {
    const ref = planReference(userId, list), snapshot = await transaction.get(ref);
    if (!snapshot.exists()) return;
    const data = snapshot.data();
    if (list.teamId && data.ownerId !== userId) throw new Error("Only the owner can delete a shared plan.");
    if (data.shareId) transaction.delete(doc(db, "sharedLists", data.shareId));
    if (data.inviteId) transaction.delete(doc(db, "listInvites", data.inviteId));
    transaction.update(ref, { deletedAt: new Date().toISOString(), shareId: "", ...(list.teamId ? { inviteId: "" } : {}) });
    addActivity(transaction, list, userId, "deleted");
  });
}
export async function restoreList(userId, getToken, list) {
  await updatePlan(userId, getToken, list, { deletedAt: "" });
}
export async function watchVotes(userId, getToken, list, onChange, onError) {
  await connectUser(userId, getToken);
  return onSnapshot(collection(db, 'collaborativeLists', list.teamId, 'votes'), (snapshot) => onChange(snapshot.docs.map((entry) => entry.data())), onError);
}
export async function voteForStop(userId, getToken, list, index, voted) {
  await connectUser(userId, getToken);
  const batch = writeBatch(db);
  batch.set(doc(db, 'collaborativeLists', list.teamId, 'votes', `${userId}_${index}`), { userId, stopIndex: index, voted });
  addActivity(batch, list, userId, 'voted');
  await batch.commit();
}

function addActivity(writer, list, userId, action) {
  if (!activityEnabled || !list.teamId || !action) return;
  writer.set(doc(collection(db, 'collaborativeLists', list.teamId, 'activity')), { actorId: userId, action, createdAt: serverTimestamp() });
}
export async function watchPlanActivity(userId, getToken, list, onChange, onError) {
  if (!activityEnabled) { onChange([]); return () => {}; }
  await connectUser(userId, getToken);
  return onSnapshot(query(collection(db, 'collaborativeLists', list.teamId, 'activity'), orderBy('createdAt', 'desc'), limit(30)), (snapshot) => onChange(snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }))), onError);
}
export async function loadCollaborators(userId, getToken, list, signal) {
  await connectUser(userId, getToken);
  const token = await auth.currentUser.getIdToken();
  const response = await fetch('/api/collaborators', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ teamId: list.teamId }), signal });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to load member names.');
  return data.members;
}
