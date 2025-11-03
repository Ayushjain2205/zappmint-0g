"use client";
import { useEffect, useState } from "react";
import LogoSmall from "@/components/icons/logo-small";
import Link from "next/link";
import AppOnlyOutputClient from "./AppOnlyOutput.client";
import TokenMarquee from "@/components/TokenMarquee";

function Spinner() {
  return (
    <svg
      className="h-8 w-8 animate-spin text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
  );
}

export default function AppViewPageClient({ id }: { id: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/app/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  let chat = data?.chat;
  let assistantMessage = data?.assistantMessage;

  return (
    <div className="min-h-screen bg-softPeach pt-[100px] font-body text-plumPurple">
      {/* Top Heading Bar */}
      <div className="flex items-center justify-between border-b border-bubblegumPink bg-white/90 px-4 py-2 shadow-sm">
        <Link href="/">
          <div className="flex items-center gap-2">
            <LogoSmall />
            <span className="bg-gradient-to-r from-bubblegumPink to-lemonYellow bg-clip-text font-heading text-lg font-bold text-transparent">
              ZappMint
            </span>
          </div>
        </Link>
        <div className="flex flex-1 justify-center">
          <div className="text-center">
            <div className="max-w-xs truncate font-heading font-semibold text-plumPurple sm:max-w-md md:max-w-lg">
              {chat ? chat.title || chat.prompt : "Loading..."}
            </div>
            <div className="text-xs text-bubblegumPink">
              {chat ? new Date(chat.createdAt).toLocaleString() : null}
            </div>
          </div>
        </div>
        <div>
          <button className="rounded bg-gradient-to-r from-lemonYellow to-bubblegumPink px-4 py-1.5 font-heading font-bold text-plumPurple shadow transition hover:from-bubblegumPink hover:to-lemonYellow hover:shadow-lg">
            Remix
          </button>
        </div>
      </div>
      {/* Token Marquee */}
      <TokenMarquee
        appName={chat?.title || chat?.prompt}
        creator="0xdsc..poc"
      />
      {/* App Output */}
      <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner />
            <div className="mt-4 text-bubblegumPink">Loading app...</div>
          </div>
        ) : error || !chat ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner />
            <div className="mt-4 text-bubblegumPink">No app output found.</div>
          </div>
        ) : !assistantMessage ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner />
            <div className="mt-4 text-bubblegumPink">No app output found.</div>
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <AppOnlyOutputClient assistantMessage={assistantMessage} />
          </div>
        )}
      </div>
    </div>
  );
}
