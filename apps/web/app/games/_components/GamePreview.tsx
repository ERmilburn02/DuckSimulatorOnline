import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";

export interface GamePreviewProps {
  image: string | StaticImport;
  name: string;
}

export default function GamePreview({ image, name }) {
  return (
    <>
      <Link href={`#`} className="hover:-translate-y-2 transition-transform">
        <Card className="w-48 m-4 bg-gray-800 border-black text-slate-300">
          <CardContent className="flex aspect-video items-center justify-center p-0">
            <div className="w-full h-full relative">
              <Image
                fill
                src={image}
                alt={name}
                className="rounded-lg object-cover"
              />
            </div>
          </CardContent>
          <CardFooter className="p-0 m-0 my-2">
            <div className="w-full flex justify-center text-center">
              <span>{name}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </>
  );
}
