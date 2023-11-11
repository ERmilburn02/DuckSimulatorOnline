import { type Metadata } from "next";
import "./globals.css";

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
      <body className="bg-slate-950 text-slate-300">{children}</body>
    </html>
  );
}
