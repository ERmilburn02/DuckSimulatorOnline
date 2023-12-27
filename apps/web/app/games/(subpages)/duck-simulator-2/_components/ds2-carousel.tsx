"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

import ss1 from "./_assets/ss_a098ed3e35dab865331c76a873c9e7d0a4aef057.jpg";
import ss2 from "./_assets/ss_0fb1776782bc328b5e6be30de69db8a41a9a57ed.jpg";
import ss3 from "./_assets/ss_24111c1576aece325ea90c4b75c875e94b15cb7d.jpg";
import ss4 from "./_assets/ss_f2c28cd9bcc6310df02babb053edb1271e86b03f.jpg";
import ss5 from "./_assets/ss_a2e9bbaf91863923fca8e837cdaca9355d455a9a.jpg";

const screenshots = [ss1, ss2, ss3, ss4, ss5];

const imageFromIndex = (index: number): string | StaticImport => {
  return screenshots.at(index);
};

export default function DS2Carousel() {
  return (
    <>
      <Carousel
        className="w-full max-w-xs"
        plugins={[
          Autoplay({
            delay: 5_000,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-0">
                    <div className="relative w-full h-full">
                      <Image
                        fill
                        src={imageFromIndex(index)}
                        alt=""
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}
