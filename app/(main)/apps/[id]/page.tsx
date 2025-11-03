import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AppOnlyOutputClient from "./AppOnlyOutput.client";
import type { Chat, Message } from "../../chats/[id]/page";
import TokenMarquee from "@/components/TokenMarquee";
import AppNavbar from "@/components/app-navbar";

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
    <div className="flex h-screen flex-col bg-softPeach font-body text-plumPurple">
      {/* Unified Navbar with App Info */}
      <AppNavbar title={chat.title || chat.prompt} creator="0xdsc..poc" />
      {/* Token Marquee */}
      <TokenMarquee appName={chat.title || chat.prompt} creator="0xdsc..poc" />
      {/* App Output - padding-top accounts for fixed navbar (~44px) and marquee (~40px) */}
      <div className="flex flex-1 flex-col overflow-hidden pt-[86px]">
        {!assistantMessage ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner />
            <div className="mt-4 font-display text-bubblegumPink">
              Loading app output...
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full">
            <AppOnlyOutputClient
              assistantMessage={assistantMessage as Message}
            />
          </div>
        )}
      </div>
    </div>
  );
}
