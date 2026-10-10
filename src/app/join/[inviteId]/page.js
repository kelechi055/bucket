import JoinList from "./join-list";

export const metadata = { title: "Join a shared plan | Bucket", robots: { index: false, follow: false } };

export default async function JoinPage({ params }) {
  const { inviteId } = await params;
  return <JoinList key={inviteId} inviteId={inviteId} />;
}
