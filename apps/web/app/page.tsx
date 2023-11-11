import Link from "next/link";

export default async function IndexPage() {
  return (
    <div className="w-full h-full grid place-items-center">
      <Link href={`/leaderboard`}>
        <button className="border-2 p-4 rounded-3xl text-2xl md:text-6xl bg-slate-800">
          Click here for Leaderboard
        </button>
      </Link>
    </div>
  );
}
