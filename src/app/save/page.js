import { auth } from "@clerk/nextjs/server";
import SavedBucketLists from "./savedList";

export default async function SavedListsPage() {
  await auth.protect();
  return <SavedBucketLists />;
}
