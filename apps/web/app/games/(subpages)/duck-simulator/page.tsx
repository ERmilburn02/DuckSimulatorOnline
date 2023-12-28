import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DuckSimulator1Page() {
  return (
    <>
      <div className="grid place-items-center h-full w-full">
        <div className="lg:mx-16 text-center flex flex-col items-center">
          <h1 className="font-bold lg:text-5xl text-2xl mb-2">
            Duck Simulator
          </h1>
          <p className="lg:mx-16 mx-4 text-sm lg:text-base">
            You might be wondering what on earth this is. Well, in order for
            Duck Simulator 2 to exist, Duck Simulator 1 had to come first! Duck
            Simulator 2 includes a remake of this game, but THIS is the one and
            only! So if you're just dying for the juicy rubber duck lore, feel
            free to check it out!
          </p>
          <Link
            href={`/games/duck-simulator-2`}
            className="text-amber-300 font-bold lg:mx-16 mx-4 text-sm lg:text-base"
          >
            If you haven't already, check out Duck Simulator 2!
          </Link>
          <br />
          <h3 className="lg:mx-16 mx-4 lg:text-xl font-bold">
            Original Description
          </h3>
          <p className="lg:mx-16 mx-4 text-sm lg:text-base">
            Need a game for your little sibling? Then Duck Simulator has you
            covered! In this simple clicker, you can quack a rubber duck to get
            coins. Simple, right? With those coins, you can go to the Quack Shop
            where you can buy upgrades such as automatic quacks or duck friends!
            If you feel like messing around, try out Challenge Mode where you
            can use your keyboard and mouse to find fun easter eggs! Wait, why
            do I hear party music?
          </p>
          <br />
          <div className="flex justify-center items-center">
            <Button asChild size="download" variant="gamejolt">
              <Link
                href={`https://gamejolt.com/games/ducksimulator/464776`}
                target="_blank"
              >
                <span>Game Jolt</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
