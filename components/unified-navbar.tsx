"use client";

import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/client";
import { defineChain } from "thirdweb/chains";

interface UnifiedNavbarProps {
  showAppInfo?: {
    title: string;
    creator?: string;
  };
}

export default function UnifiedNavbar({ showAppInfo }: UnifiedNavbarProps) {
  const ogAristotle = defineChain(16661);
  return (
    <header className="fixed left-0 top-0 z-40 w-full bg-softPeach px-6 py-1">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Zappmint */}
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center">
              <div className="">
                <Image
                  src="/new_logo.png"
                  alt="Zappmint Logo"
                  width={48}
                  height={48}
                  priority
                  className="object-contain"
                />
              </div>
              <span className="ml-2 text-2xl font-bold tracking-wide">
                <span className="font-sketch text-plumPurple">Zapp</span>
                <span className="font-heading text-plumPurple">mint</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Connect Button */}
        <div className="flex items-center gap-4">
          <ConnectButton
            client={client}
            theme="light"
            connectButton={{
              label: "Connect Wallet",
              style: {
                height: "36px",
                width: "100px",
                backgroundColor: "#4C1B3F",
                color: "#FFFFFF",
              },
            }}
            detailsButton={{
              style: {
                height: "36px",
                width: "100px",
                borderColor: "#4C1B3F",
              },
              connectedAccountAvatarUrl: "",
            }}
            switchButton={{
              style: {
                height: "36px",
                width: "100px",
                backgroundColor: "#4C1B3F",
                color: "#FFFFFF",
              },
            }}
            chain={ogAristotle}
          />
        </div>
      </div>
    </header>
  );
}
