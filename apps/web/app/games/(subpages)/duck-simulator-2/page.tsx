import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXbox, faSteam } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import DS2Carousel from "./_components/ds2-carousel";

export default function DuckSimulator2Page() {
  return (
    <>
      <div className="grid place-items-center h-full w-full">
        <div className="lg:mx-16 text-center flex flex-col items-center">
          <DS2Carousel />
          <h1 className="font-bold lg:text-5xl text-2xl mb-2">
            Duck Simulator 2
          </h1>
          <p className="lg:mx-16 mx-4 text-sm lg:text-base">
            Duck Simulator 2 is a game about quacking a rubber duck. Seems
            simple enough, right? Eventually, the game begins to break and the
            developer is left with no choice but to create several temporary
            games.
          </p>
          <br />
          <p className="lg:mx-16 mx-4 text-sm lg:text-base">
            The game includes four genres in the campaign, a remastered version
            of the first game, and more! Duck Simulator 2 is currently available
            to download for free on XBOX and Steam!
          </p>
          <br />
          <div className="flex justify-center items-center">
            {/* <Link
              href={`https://xbox.com/en-us/games/store/duck-simulator-2/9pkkrpblfqpk`}
              target="_blank"
            >
              <button className="border rounded-xl w-44 h-16 p-1 mx-1 bg-[#0e7a0d] font-bold flex justify-center items-center text-3xl">
                <FontAwesomeIcon icon={faXbox} className="mr-2" />
                <span>Xbox</span>
              </button>
            </Link>
            <Link href={`https://s.team/a/1808800`} target="_blank">
              <button className="border rounded-xl w-44 h-16 p-1 mx-1 bg-[#171a21] font-bold flex justify-center items-center text-3xl">
                <FontAwesomeIcon icon={faSteam} className="mr-2" />
                <span>Steam</span>
              </button>
            </Link> */}
            <Button asChild size="download" variant="xbox">
              <Link
                href={`https://xbox.com/en-us/games/store/duck-simulator-2/9pkkrpblfqpk`}
                target="_blank"
              >
                <FontAwesomeIcon icon={faXbox} className="mr-2" />
                <span>Xbox</span>
              </Link>
            </Button>

            <Button asChild size="download" variant="steam">
              <Link href={`https://s.team/a/1808800`} target="_blank">
                <FontAwesomeIcon icon={faSteam} className="mr-2" />
                <span>Steam</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
