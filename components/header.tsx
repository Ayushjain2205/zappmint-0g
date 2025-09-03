import Image from "next/image";

import logo from "@/public/new_logo.png";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative mx-auto flex w-full shrink-0 items-center justify-center py-6">
      <Link href="/">
        <div className="flex items-center gap-2 align-middle">
          <Image
            src={logo}
            alt=""
            quality={100}
            className="h-9 w-auto object-contain align-middle"
            priority
          />
          <span className="flex items-baseline text-2xl font-bold tracking-wide">
            <span className="font-sketch leading-none text-plumPurple">
              Zapp
            </span>
            <span className="font-heading leading-none text-plumPurple">
              mint
            </span>
          </span>
        </div>
      </Link>
    </header>
  );
}
