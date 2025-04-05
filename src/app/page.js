import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Link
        href="/generate"
        className="text-white bg-blue-500 px-4 py-2 rounded"
      >
        Go to Generate List
      </Link>
    </div>
  );
}
