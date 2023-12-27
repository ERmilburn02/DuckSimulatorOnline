import GamePreview from "./_components/GamePreview";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

import ds1Image from "./_assets/ds1.webp";
import ds2Image from "./_assets/ds2.jpg";
import qkImage from "./_assets/qk.png";

import blackImage from "./_assets/black720p.png";

const GAMES: {
  name: string;
  image: StaticImport;
}[] = [
  {
    name: "Duck Simulator",
    image: ds1Image,
  },
  {
    name: "Duck Simulator 2",
    image: ds2Image,
  },
  {
    name: "Duck Simulator 3",
    image: blackImage,
  },
  {
    name: "Quazy Karts",
    image: qkImage,
  },
];

export default function GamesPage() {
  return (
    <>
      <div className="flex flex-col w-full h-full items-center">
        <h1 className="font-bold text-5xl mt-4">Games</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
          {GAMES.map((game, index) => (
            <GamePreview key={index} name={game.name} image={game.image} />
          ))}
        </div>
      </div>
    </>
  );
}
