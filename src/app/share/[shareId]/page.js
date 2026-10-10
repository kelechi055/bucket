import SharedList from "./shared-list";

export const metadata = { title: "Shared list | Bucket", robots: { index: false, follow: false } };

export default async function SharedListPage({ params }) {
  const { shareId } = await params;
  return <SharedList key={shareId} shareId={shareId} />;
}
