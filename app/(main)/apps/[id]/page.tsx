import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AppOnlyOutputClient from "./AppOnlyOutput.client";
import type { Chat, Message } from "../../chats/[id]/page";
import LogoSmall from "@/components/icons/logo-small";
import Link from "next/link";
import Image from "next/image";
import TokenDrawer from "@/components/TokenDrawer";

function Spinner() {
  return (
    <svg
      className="h-8 w-8 animate-spin text-yellow-400"
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

export default async function AppViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prisma = getPrisma();
  const chat = await prisma.chat.findFirst({
    where: { id },
    include: { messages: { orderBy: { position: "asc" } } },
  });
  if (!chat) notFound();
  const assistantMessage = chat.messages
    .filter((m: Message) => m.role === "assistant")
    .at(-1);

  return (
    <div className="min-h-screen bg-softPeach font-body text-plumPurple">
      {/* Token Drawer */}
      <TokenDrawer />
      {/* Top Heading Bar */}
      <div className="fixed left-0 top-0 z-20 flex w-full items-center justify-between border-b border-bubblegumPink bg-white/90 px-4 py-2 shadow-sm">
        <Link href="/">
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
        </Link>
        <div className="flex flex-1 justify-center">
          <div className="text-center">
            <div className="flex max-w-xs flex-wrap items-center justify-center gap-1 font-heading font-semibold text-plumPurple sm:max-w-md md:max-w-lg">
              <span className="truncate">{chat.title || chat.prompt}</span>
              <span className="mx-1 font-normal text-bubblegumPink">by</span>
              <span className="truncate text-sm font-normal text-mintGreen">
                0xdsc..poc
              </span>
            </div>
          </div>
        </div>
        <div>
          <button className="rounded bg-bubblegumPink px-4 py-1.5 font-heading font-bold text-plumPurple shadow-md transition-all hover:bg-lemonYellow">
            Remix
          </button>
        </div>
      </div>
      {/* App Output */}
      <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center pt-16">
        {!assistantMessage ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner />
            <div className="mt-4 font-display text-bubblegumPink">
              Loading app output...
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <AppOnlyOutputClient
              assistantMessage={assistantMessage as Message}
            />
          </div>
        )}
      </div>
    </div>
  );
}
