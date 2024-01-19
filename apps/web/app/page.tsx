import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import DuckImage from "./_assets/Duck.png";

export default async function IndexPage() {
  return (
    <>
      <div className="grid place-items-center h-full w-full">
        <div className="lg:mx-16 text-center">
          <h1 className="font-bold lg:text-5xl text-2xl mb-2">
            Welcome to Duck Simulator!
          </h1>
          <div className="mt-16 flex items-center justify-center">
            <div className="relative w-64 h-64">
              <Image
                src={DuckImage}
                alt="Image"
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
