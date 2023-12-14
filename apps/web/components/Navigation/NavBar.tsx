import NavBarItem from "./NavBarItem";

export default async function NavBar() {
  return (
    <>
      <aside
        className="lg:w-60 lg:h-full h-16 w-full bg-gray-800"
        aria-label="Sidebar"
      >
        <div className="w-full py-2 lg:w-auto lg:h-full lg:overflow-y-auto lg:py-4 px-3">
          <ul className="flex flex-row lg:flex-col justify-evenly lg:justify-start h-full">
            <NavBarItem name="Home" link="/" />
            <NavBarItem name="Duck Simulator 2" link="/duck-simulator-2" />
            <NavBarItem name="Duck Simulator 3" link="/duck-simulator-3" />
            <NavBarItem name="Quazy Karts" link="/quazy-karts" grow />
            <NavBarItem name="Leaderboard" link="/leaderboard" />
          </ul>
        </div>
      </aside>
    </>
  );
}
