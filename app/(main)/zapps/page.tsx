/* eslint-disable @next/next/no-img-element */
"use client";

import Spinner from "@/components/spinner";
import { ZappCard, ZappIcons } from "@/components/ZappCard";
import { useEffect, useState } from "react";
import { getAllChats } from "../actions";
import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/client";
import Link from "next/link";

// Add type for Chat
interface Chat {
  id: string;
  model: string;
  quality: string;
  prompt: string;
  title: string;
  createdAt: string;
}

export default function ZappsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    (async () => {
      const result = await getAllChats();
      setChats(
        result.map((chat: any) => ({
          ...chat,
          createdAt:
            typeof chat.createdAt === "string"
              ? chat.createdAt
              : chat.createdAt.toISOString(),
        })),
      );
      setLoadingApps(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-softPeach font-body text-plumPurple">
      {/* Header */}
      <header className="absolute left-0 top-0 z-50 w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="">
              <Image
                src="/new_logo.png"
                alt="ZapForge Logo"
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
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-lg bg-bubblegumPink px-4 py-2 font-heading text-sm font-medium text-plumPurple transition-colors hover:bg-lemonYellow"
            >
              Home
            </Link>
            <ConnectButton client={client} theme="light" />
          </div>
        </div>
      </header>

      {/* Background overlays */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-bubblegumPink/20 via-lemonYellow/10 to-transparent" />
      {/* Main Content */}
      <section className="relative z-20 flex min-h-screen flex-col px-4 pb-20 pt-16">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-heading text-6xl font-bold text-plumPurple">
              Top Zapps ⭐
            </h1>
            <p className="mb-8 text-lg text-plumPurple/80">
              Discover the most popular and trending Zapps built by the
              <br />
              community
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory("Trending")}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === "Trending"
                    ? "border-orange-300 bg-orange-100 text-orange-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                🔥 Trending
              </button>
              <button
                onClick={() => setSelectedCategory("Games")}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === "Games"
                    ? "border-purple-300 bg-purple-100 text-purple-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                🎮 Games
              </button>
              <button
                onClick={() => setSelectedCategory("Analytics")}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === "Analytics"
                    ? "border-pink-300 bg-pink-100 text-pink-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setSelectedCategory("DeFi")}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === "DeFi"
                    ? "border-blue-300 bg-blue-100 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                💼 DeFi
              </button>
              <button
                onClick={() => setSelectedCategory("Learning")}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === "Learning"
                    ? "border-green-300 bg-green-100 text-green-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                🧠 Learning
              </button>
              <button
                onClick={() => setSelectedCategory("All")}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === "All"
                    ? "border-gray-300 bg-gray-100 text-gray-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                All ({chats.length})
              </button>
            </div>
          </div>
          {loadingApps ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {chats.slice(0, 8).map((chat, idx) => {
                // Simple mapping for category/icon/gradient
                const categories = [
                  {
                    category: "Finance",
                    icon: (
                      <ZappIcons.Wallet className="h-4 w-4 text-lemonYellow" />
                    ),
                    gradient: "from-lemonYellow to-tangerinePop",
                  },
                  {
                    category: "NFT",
                    icon: (
                      <ZappIcons.ImageIcon className="h-4 w-4 text-bubblegumPink" />
                    ),
                    gradient: "from-bubblegumPink to-plumPurple",
                  },
                  {
                    category: "Analytics",
                    icon: (
                      <ZappIcons.BarChart3 className="h-4 w-4 text-skyBlue" />
                    ),
                    gradient: "from-skyBlue to-mintGreen",
                  },
                  {
                    category: "DeFi",
                    icon: <ZappIcons.Zap className="h-4 w-4 text-mintGreen" />,
                    gradient: "from-mintGreen to-lemonYellow",
                  },
                  {
                    category: "Social",
                    icon: (
                      <ZappIcons.Users className="h-4 w-4 text-plumPurple" />
                    ),
                    gradient: "from-plumPurple to-bubblegumPink",
                  },
                  {
                    category: "Metaverse",
                    icon: (
                      <ZappIcons.Boxes className="h-4 w-4 text-tangerinePop" />
                    ),
                    gradient: "from-tangerinePop to-bubblegumPink",
                  },
                  {
                    category: "Governance",
                    icon: (
                      <ZappIcons.Layout className="h-4 w-4 text-lemonYellow" />
                    ),
                    gradient: "from-lemonYellow to-tangerinePop",
                  },
                  {
                    category: "Explorer",
                    icon: (
                      <ZappIcons.Globe className="h-4 w-4 text-mintGreen" />
                    ),
                    gradient: "from-mintGreen to-skyBlue",
                  },
                ];
                const cat = categories[idx % categories.length];
                return (
                  <ZappCard
                    key={chat.id}
                    project={{
                      id: chat.id,
                      title: chat.title || chat.prompt.slice(0, 32),
                      creator: "0x0000000000000000000000000000000000000000", // Placeholder
                      category: cat.category,
                      icon: cat.icon,
                      gradient: cat.gradient,
                    }}
                  />
                );
              })}
            </div>
          )}
          <div className="mt-10 text-center">
            <button className="rounded border border-bubblegumPink px-4 py-2 font-display text-plumPurple hover:bg-bubblegumPink/20">
              Show More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
