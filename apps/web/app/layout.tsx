import { type Metadata } from "next";
import "./globals.css";
import NavBar from "../components/Navigation/NavBar";

// Font Awesome

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import "@fortawesome/fontawesome-svg-core/styles.css";

export const metadata: Metadata = {
  title: "Duck Simulator",
  description:
    "A genre-defying phenomenon that will take you on a journey to stop a rubber duck from taking over the developer's game!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-300 flex flex-col">
        <div className="flex lg:flex-row flex-col h-full">
          <NavBar />
          <main className="flex-1 h-auto lg:h-full bg-gray-700 text-white overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
