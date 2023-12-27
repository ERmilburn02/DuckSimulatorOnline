import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Link from "next/link";

import { Url } from "../../types";
import { cn } from "@/lib/utils";

export default function NavBarItem({
  name,
  icon,
  link,
  external,
  grow,
  mobile,
}: {
  name: string;
  icon: IconDefinition;
  link: Url;
  external?: boolean;
  grow?: boolean;
  mobile?: boolean;
}) {
  const target = external ? "_blank" : undefined;
  const showOnMobile = mobile == true;
  const dontShowOnMobile = mobile == false;

  return (
    <>
      <li
        className={cn(
          grow && "lg:grow",
          dontShowOnMobile && "hidden lg:block",
          showOnMobile && "block lg:hidden"
        )}
      >
        <Link
          href={link}
          target={target}
          className="flex items-center p-2 text-3xl font-normal rounded-lg text-white hover:bg-gray-700"
        >
          <FontAwesomeIcon
            icon={icon}
            className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white"
          />
          <span className="ml-3 lg:block hidden lg:text-lg">{name}</span>
        </Link>
      </li>
    </>
  );
}
