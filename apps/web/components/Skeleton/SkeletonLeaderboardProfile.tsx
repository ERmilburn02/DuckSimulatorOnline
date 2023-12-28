import Image from "next/image";

export default function SkeletonLeaderboardProfile() {
  return (
    <>
      <div className="grid grid-cols-level-leaderboard grid-rows-2 text-center items-center justify-items-center w-full md:w-[98%] h-24 md:h-36 border rounded-3xl md:my-2 mx-auto">
        <div className="row-span-2 font-bold text-xl md:text-5xl m-1 overflow-hidden">
          #
        </div>
        <div className="row-span-2 overflow-hidden">
          <div className="relative w-16 h-16 md:w-32 md:h-32 m-4">
            <Image
              src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==
              "
              alt="Profile Image"
              fill
              className="object-cover rounded-full"
              unoptimized
            />
          </div>
        </div>
        <div className="text-md md:text-3xl overflow-hidden whitespace-nowrap overflow-ellipsis w-10/12">
          Loading...
        </div>
        <div className="text-md md:text-3xl">Loading...</div>
        <div className="text-md md:text-3xl">Loading...</div>
        <div className="text-md md:text-3xl">Loading...</div>
      </div>
    </>
  );
}
