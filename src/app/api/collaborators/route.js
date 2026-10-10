import { auth, clerkClient } from '@clerk/nextjs/server';
import { firebaseConfig } from '../../../lib/firebase-config';
const requests = new Map();
export async function POST(request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Sign in to view collaborators.' }, { status: 401 });
  const now = Date.now(), previous = requests.get(userId);
  const usage = previous && previous.until > now ? previous : { count: 0, until: now + 60000 };
  if (++usage.count > 30) return Response.json({ error: 'Please wait before loading member names again.' }, { status: 429 });
  if (requests.size > 1000) requests.delete(requests.keys().next().value);
  requests.set(userId, usage);
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  if (!/^[A-Za-z0-9]{20}$/.test(body?.teamId || '') || !token || token.length > 10000) return Response.json({ error: 'Invalid request.' }, { status: 400 });
  try {
    const identity = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: token }), cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!identity.ok || (await identity.json()).users?.[0]?.localId !== userId) return Response.json({ error: 'Your account could not be verified.' }, { status: 403 });
    // Read with the caller's Firebase identity, so membership rules still apply.
    const plan = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/collaborativeLists/${body.teamId}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!plan.ok) return Response.json({ error: 'This shared plan is unavailable.' }, { status: 403 });
    const data = await plan.json();
    const memberIds = data.fields?.memberIds?.arrayValue?.values?.map((value) => value.stringValue) || [];
    if (!memberIds.includes(userId) || memberIds.length > 20) return Response.json({ error: 'This shared plan is unavailable.' }, { status: 403 });
    const client = await clerkClient();
    const users = await client.users.getUserList({ userId: memberIds, limit: 20 });
    return Response.json({ members: users.data.filter((user) => memberIds.includes(user.id)).map((user) => ({ id: user.id, name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Collaborator', imageUrl: user.imageUrl?.startsWith('https://') ? user.imageUrl : '' })) }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return Response.json({ error: 'Member names are temporarily unavailable.' }, { status: 503 }); }
}
