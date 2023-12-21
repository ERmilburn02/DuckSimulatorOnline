import NavBarItem from "./NavBarItem";

import {
  faHouse,
  fa2,
  fa3,
  faCar,
  faRankingStar,
  fa1,
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
            <NavBarItem
              name="Duck Simulator"
              link="/games/duck-simulator"
              icon={fa1}
            />
            <NavBarItem
              name="Duck Simulator 2"
              link="/games/duck-simulator-2"
              icon={fa2}
            />
            <NavBarItem
              name="Duck Simulator 3"
              link="/games/duck-simulator-3"
              icon={fa3}
            />
            <NavBarItem
              name="Quazy Karts"
              link="/games/quazy-karts"
              grow
              icon={faCar}
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
