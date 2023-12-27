import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import NavBarItem from "./NavBarItem";

import {
  faHouse,
  fa2,
  fa3,
  faCar,
  faRankingStar,
  fa1,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";

export default async function NavBar() {
  return (
    <>
      <aside
        className="lg:w-60 lg:h-full h-16 w-full bg-gray-800"
        aria-label="Sidebar"
      >
        <div className="w-full py-2 lg:w-auto lg:h-full lg:overflow-y-auto lg:py-4 px-3">
          <ul className="flex flex-row lg:flex-col justify-evenly lg:justify-start h-full">
            <NavBarItem name="Home" link="/" icon={faHouse} />
            <NavBarItem name="Games" link="/games" icon={faGamepad} />
            <NavBarItem
              name="Duck Simulator"
              link="/games/duck-simulator"
              icon={fa1}
              mobile={false}
            />
            <NavBarItem
              name="Duck Simulator 2"
              link="/games/duck-simulator-2"
              icon={fa2}
              mobile={false}
            />
            <NavBarItem
              name="Duck Simulator 3"
              link="/games/duck-simulator-3"
              icon={fa3}
              mobile={false}
            />
            <NavBarItem
              name="Quazy Karts"
              link="/games/quazy-karts"
              grow
              icon={faCar}
              mobile={false}
            />
            <NavBarItem
              name="Discord"
              link="https://discord.gg/duck-simulator-908148295606628363"
              icon={faDiscord}
              external
            />
            <NavBarItem
              name="Leaderboard"
              link="/leaderboard"
              icon={faRankingStar}
            />
          </ul>
        </div>
      </aside>
    </>
  );
}
