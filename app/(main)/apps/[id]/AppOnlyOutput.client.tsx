"use client";
import { extractFirstCodeBlock } from "@/lib/utils";
import dynamic from "next/dynamic";
import type { Message } from "../../chats/[id]/page";

const CodeRunner = dynamic(() => import("@/components/code-runner"), {
  ssr: false,
});

export default function AppOnlyOutputClient({
  assistantMessage,
}: {
  assistantMessage: Message;
}) {
  const codeBlock = extractFirstCodeBlock(assistantMessage.content);

  if (!codeBlock) {
    return <div>No code block found in the assistant message.</div>;
  }

  return (
    <div className="w-full max-w-2xl rounded-lg bg-white p-6 text-base shadow">
      <CodeRunner
        language={codeBlock.language || ""}
        code={codeBlock.code}
        onRequestFix={() => {}}
      />
    </div>
  );
}
