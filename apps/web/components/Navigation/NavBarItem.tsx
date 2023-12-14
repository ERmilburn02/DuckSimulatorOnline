import Link from "next/link";

import { Url } from "../../types";

export default function NavBarItem({
  name,
  //   icon,
  link,
  external,
  grow,
}: {
  name: string;
  //   icon: IconDefinition;
  link: Url;
  external?: boolean;
  grow?: boolean;
}) {
  const target = external ? "_blank" : undefined;

  return (
    <>
      <li className={grow ? "lg:grow" : ""}>
        <Link
          href={link}
          target={target}
          className="flex items-center p-2 text-3xl font-normal rounded-lg text-white hover:bg-gray-700"
        >
          {/* TODO: Icon */}
          {/* <FontAwesomeIcon
            icon={icon}
            className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white"
          /> */}
          <span className="ml-3 lg:block hidden lg:text-lg">{name}</span>
        </Link>
      </li>
    </>
  );
}
