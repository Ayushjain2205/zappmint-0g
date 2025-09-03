import Providers from "@/app/(main)/providers";
import { Toaster } from "@/components/ui/toaster";
import {
  Barlow,
  Londrina_Solid,
  Londrina_Sketch,
  Dosis,
} from "next/font/google";

// Heading font - playful/brand
const londrinaSolid = Londrina_Solid({
  subsets: ["latin"],
  weight: ["100", "300", "400", "900"],
  display: "swap",
  variable: "--font-heading",
});

// Sketch font for special accents
const londrinaSketch = Londrina_Sketch({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-sketch",
});

// Display font - bold, industrial feel
const dosis = Dosis({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dosis",
});

// Body font - clean, readable
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-barlow",
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`min-h-screen font-body ${londrinaSolid.variable} ${londrinaSketch.variable} ${dosis.variable} ${barlow.variable}`}
    >
      <Providers>
        {children}
        <Toaster />
      </Providers>
    </div>
  );
}
