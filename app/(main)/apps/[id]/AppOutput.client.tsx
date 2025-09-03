"use client";
import dynamic from "next/dynamic";
import type { Chat, Message } from "../../chats/[id]/page";

const CodeViewer = dynamic(() => import("../../chats/[id]/code-viewer"), {
  ssr: false,
});

export default function AppOutputClient({
  chat,
  assistantMessage,
}: {
  chat: Chat;
  assistantMessage: Message;
}) {
  return (
    <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow">
      <CodeViewer
        chat={chat}
        streamText={""}
        message={assistantMessage}
        onMessageChange={() => {}}
        activeTab={"preview"}
        onTabChange={() => {}}
        onClose={() => {}}
        onRequestFix={() => {}}
      />
    </div>
  );
}
