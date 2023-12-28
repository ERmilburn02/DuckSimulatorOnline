import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Url, GameStatus } from "@/types";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";

export interface GamePreviewProps {
  image: string | StaticImport;
  name: string;
  link: Url;
  status: GameStatus;
}

function StatusToString(status: GameStatus) {
  switch (status) {
    case "Released":
      return "Released";
    case "Cancelled":
      return "Cancelled";
    case "Development":
      return "In Development";
    case "Hold":
      return "On Hold";
    default:
      throw new Error("Unexpected GameStatus");
  }
}

export default function GamePreview({
  image,
  name,
  link,
  status,
}: GamePreviewProps) {
  return (
    <>
      <Link href={link} className="hover:-translate-y-2 transition-transform">
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
            <div className="w-full flex flex-col items-center justify-center text-center space-y-1">
              <span>{name}</span>
              <Badge
                className={cn(
                  status == "Released" && "bg-green-400 text-black",
                  status == "Hold" && "bg-slate-400 text-black",
                  status == "Cancelled" && "bg-red-500"
                )}
              >
                {StatusToString(status)}
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </>
  );
}
