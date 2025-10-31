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
    <header className="absolute left-0 top-0 z-50 w-full px-6 py-1">
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

        {/* Center: App Name and Creator (only on apps page) */}
        {showAppInfo && (
          <div className="flex flex-1 justify-center">
            <div className="text-center">
              <div className="flex max-w-xs flex-wrap items-center justify-center gap-1 font-heading font-semibold text-plumPurple sm:max-w-md md:max-w-lg">
                <span className="truncate">{showAppInfo.title}</span>
                {showAppInfo.creator && (
                  <>
                    <span className="mx-1 font-normal text-bubblegumPink">
                      by
                    </span>
                    <span className="truncate text-sm font-normal text-mintGreen">
                      {showAppInfo.creator}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

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
              },
            }}
            detailsButton={{
              style: {
                height: "36px",
                width: "100px",
              },
              connectedAccountAvatarUrl: "",
            }}
            switchButton={{
              style: {
                height: "36px",
                width: "100px",
              },
            }}
            chain={ogAristotle}
          />
        </div>
      </div>
    </header>
  );
}
