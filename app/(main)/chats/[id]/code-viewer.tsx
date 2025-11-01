"use client";

import CloseIcon from "@/components/icons/close-icon";
import RefreshIcon from "@/components/icons/refresh";
import { extractFirstCodeBlock, splitByFirstCodeFence } from "@/lib/utils";
import { useState } from "react";
import type { Chat, Message } from "./page";
import { Share } from "./share";
import { StickToBottom } from "use-stick-to-bottom";
import dynamic from "next/dynamic";
import ShareIcon from "@/components/icons/share-icon";
import {
  CodeXml,
  Eye,
  ChevronDownIcon,
  FileCode,
  Monitor,
  Smartphone,
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Select from "@radix-ui/react-select";

const CodeRunner = dynamic(() => import("@/components/code-runner"), {
  ssr: false,
});
const SyntaxHighlighter = dynamic(
  () => import("@/components/syntax-highlighter"),
  {
    ssr: false,
  },
);

export default function CodeViewer({
  chat,
  streamText,
  message,
  onMessageChange,
  activeTab,
  onTabChange,
  onClose,
  onRequestFix,
}: {
  chat: Chat;
  streamText: string;
  message?: Message;
  onMessageChange: (v: Message) => void;
  activeTab: string;
  onTabChange: (v: "code" | "preview") => void;
  onClose: () => void;
  onRequestFix: (e: string) => void;
}) {
  const app = message ? extractFirstCodeBlock(message.content) : undefined;
  const streamAppParts = splitByFirstCodeFence(streamText);
  const streamApp = streamAppParts.find(
    (p) =>
      p.type === "first-code-fence-generating" || p.type === "first-code-fence",
  );
  const streamAppIsGenerating = streamAppParts.some(
    (p) => p.type === "first-code-fence-generating",
  );

  const code = streamApp ? streamApp.content : app?.code || "";
  const language = streamApp ? streamApp.language : app?.language || "";
  const title = streamApp ? streamApp.filename.name : app?.filename?.name || "";
  const layout = ["python", "ts", "js", "javascript", "typescript"].includes(
    language,
  )
    ? "two-up"
    : "tabbed";

  const assistantMessages = chat.messages.filter((m) => m.role === "assistant");
  const currentVersion = streamApp
    ? assistantMessages.length
    : message
      ? assistantMessages.map((m) => m.id).indexOf(message.id)
      : 0;

  const [refresh, setRefresh] = useState(0);
  const [showCoinPopup, setShowCoinPopup] = useState(false);
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">(
    "desktop",
  );

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between rounded-tl-2xl border-b-2 border-bubblegumPink bg-white px-4">
        <div className="inline-flex flex-1 items-center gap-4">
          <button
            className="text-bubblegumPink hover:text-lemonYellow"
            onClick={onClose}
          >
            <CloseIcon className="size-5" />
          </button>
          <Select.Root
            value={
              currentVersion >= 0 && currentVersion < assistantMessages.length
                ? String(currentVersion)
                : undefined
            }
            onValueChange={(value) => {
              const versionIndex = parseInt(value, 10);
              const targetMessage = assistantMessages[versionIndex];
              if (targetMessage) {
                onMessageChange(targetMessage);
              }
            }}
          >
            <Select.Trigger className="inline-flex items-center gap-2 rounded-md border-2 border-bubblegumPink bg-white px-3 py-1.5 font-heading text-sm text-plumPurple hover:bg-bubblegumPink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lemonYellow">
              <FileCode className="size-4 text-plumPurple" />
              <Select.Value>v{currentVersion + 1}</Select.Value>
              <Select.Icon>
                <ChevronDownIcon className="size-4 text-plumPurple" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="z-50 min-w-[140px] overflow-hidden rounded-md border-2 border-bubblegumPink bg-white shadow-lg">
                <Select.Viewport className="p-1">
                  {assistantMessages.map((m, index) => (
                    <Select.Item
                      key={m.id}
                      value={String(index)}
                      className="relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 font-heading text-sm text-plumPurple outline-none hover:bg-lemonYellow hover:text-plumPurple focus:bg-lemonYellow focus:text-plumPurple data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <FileCode className="size-4" />
                      <Select.ItemText>Version {index + 1}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <div className="flex items-center gap-1">
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white text-plumPurple transition-colors hover:bg-bubblegumPink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lemonYellow"
                    onClick={() => setRefresh((r) => r + 1)}
                  >
                    <RefreshIcon className="size-3.5" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="rounded-lg bg-plumPurple px-3 py-1.5 font-heading text-sm text-white shadow-lg"
                    sideOffset={5}
                  >
                    Refresh
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    disabled={!message}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white text-plumPurple transition-colors hover:bg-bubblegumPink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lemonYellow disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={(e) => {
                      e.preventDefault();
                      if (message) {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/share/v2/${message.id}`,
                        );
                      }
                    }}
                  >
                    <ShareIcon className="size-3.5" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="rounded-lg bg-plumPurple px-3 py-1.5 font-heading text-sm text-white shadow-lg"
                    sideOffset={5}
                  >
                    Share
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
        <div className="hidden flex-1 items-center justify-center md:inline-flex">
          <Tooltip.Provider>
            <div className="relative flex gap-0.5 rounded-md border-2 border-bubblegumPink bg-white p-0.5">
              {/* Sliding indicator */}
              <div
                className={`absolute h-8 w-8 rounded-md bg-lemonYellow shadow-sm transition-transform duration-300 ease-in-out ${viewportMode === "desktop" ? "translate-x-0" : "translate-x-[calc(100%+0.125rem)]"}`}
                aria-hidden="true"
              />
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => setViewportMode("desktop")}
                    className={`relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-md font-heading text-base font-bold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lemonYellow ${viewportMode === "desktop" ? "text-plumPurple" : "text-plumPurple opacity-60"}`}
                  >
                    <Monitor className="size-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="rounded-lg bg-plumPurple px-3 py-1.5 font-heading text-sm text-white shadow-lg"
                    sideOffset={5}
                  >
                    Desktop
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => setViewportMode("mobile")}
                    className={`relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-md font-heading text-base font-bold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lemonYellow ${viewportMode === "mobile" ? "text-plumPurple" : "text-plumPurple opacity-60"}`}
                  >
                    <Smartphone className="size-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="rounded-lg bg-plumPurple px-3 py-1.5 font-heading text-sm text-white shadow-lg"
                    sideOffset={5}
                  >
                    Mobile
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
          </Tooltip.Provider>
        </div>
        <div className="inline-flex flex-1 items-center justify-end gap-2">
          {layout === "tabbed" && (
            <Tooltip.Provider>
              <div className="relative flex gap-0.5 rounded-md border-2 border-bubblegumPink bg-white p-0.5">
                {/* Sliding indicator */}
                <div
                  className={`absolute h-8 w-8 rounded-md bg-lemonYellow shadow-sm transition-transform duration-300 ease-in-out ${activeTab === "code" ? "translate-x-0" : "translate-x-[calc(100%+0.125rem)]"}`}
                  aria-hidden="true"
                />
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => onTabChange("code")}
                      data-active={activeTab === "code" ? true : undefined}
                      className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-md font-heading text-base font-bold text-plumPurple outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lemonYellow"
                    >
                      <CodeXml className="size-4" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="rounded-lg bg-plumPurple px-3 py-1.5 font-heading text-sm text-white shadow-lg"
                      sideOffset={5}
                    >
                      Code
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => onTabChange("preview")}
                      data-active={activeTab === "preview" ? true : undefined}
                      className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-md font-heading text-base font-bold text-plumPurple outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-lemonYellow"
                    >
                      <Eye className="size-4" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="rounded-lg bg-plumPurple px-3 py-1.5 font-heading text-sm text-white shadow-lg"
                      sideOffset={5}
                    >
                      Preview
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>
            </Tooltip.Provider>
          )}
          <button
            type="button"
            disabled={!message}
            className="inline-flex items-center gap-1 rounded border-2 border-bubblegumPink bg-lemonYellow px-3 py-1.5 font-heading text-sm font-bold text-plumPurple shadow-sm transition-colors hover:bg-bubblegumPink hover:text-lemonYellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lemonYellow disabled:cursor-not-allowed disabled:opacity-50"
            onClick={(e) => {
              e.preventDefault();
              setShowCoinPopup(true);
            }}
          >
            Publish
          </button>
        </div>
      </div>

      {showCoinPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative flex w-full min-w-[350px] max-w-lg flex-col items-center rounded-xl bg-white p-0 shadow-lg">
            <button
              className="absolute right-2 top-2 text-bubblegumPink hover:text-lemonYellow"
              onClick={() => setShowCoinPopup(false)}
            >
              <CloseIcon className="size-5" />
            </button>
            {/* Coin SVG at the top */}
            <div className="flex w-full flex-col items-center pt-8">
              <img src="/coin.svg" alt="Coin" className="mb-2 h-16 w-16" />
              <h2 className="mb-2 font-heading text-2xl text-plumPurple">
                Coin your $zapp
              </h2>
            </div>
            <div className="flex w-full flex-col items-center px-8 pb-8">
              <div className="mt-6 w-full rounded-lg border-2 border-bubblegumPink bg-gray-50 p-4 font-heading text-plumPurple">
                <p className="text-center">
                  Coin creation is being migrated to thirdweb. Coming soon!
                </p>
              </div>
              <button
                className="mt-6 gap-2 rounded-xl bg-bubblegumPink px-6 py-3 font-heading font-bold text-plumPurple shadow-md transition-all hover:bg-lemonYellow"
                onClick={() => setShowCoinPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {layout === "tabbed" ? (
        <div className="flex grow flex-col overflow-y-auto bg-white text-plumPurple">
          {activeTab === "code" ? (
            <StickToBottom
              className="relative grow overflow-hidden px-6 py-4"
              resize="smooth"
              initial={streamAppIsGenerating ? "smooth" : false}
            >
              <StickToBottom.Content>
                <SyntaxHighlighter code={code} language={language} />
              </StickToBottom.Content>
            </StickToBottom>
          ) : (
            <>
              {language && (
                <div
                  className={`flex h-full items-center justify-center ${viewportMode === "mobile" ? "mx-auto max-w-[400px]" : ""}`}
                >
                  <div
                    className={
                      viewportMode === "mobile"
                        ? "w-full max-w-[375px]"
                        : "h-full w-full"
                    }
                  >
                    <CodeRunner
                      onRequestFix={onRequestFix}
                      language={language}
                      code={code}
                      key={refresh}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex grow flex-col bg-softPeach">
          <div className="h-1/2 overflow-y-auto">
            <SyntaxHighlighter code={code} language={language} />
          </div>
          <div className="flex h-1/2 flex-col">
            <div className="border-t border-bubblegumPink bg-bubblegumPink/70 px-4 py-4 font-heading text-bubblegumPink">
              Output
            </div>
            <div
              className={`flex grow items-center justify-center border-t border-bubblegumPink ${viewportMode === "mobile" ? "mx-auto max-w-[375px]" : ""}`}
            >
              {!streamAppIsGenerating && (
                <div
                  className={
                    viewportMode === "mobile"
                      ? "w-full max-w-[375px]"
                      : "w-full"
                  }
                >
                  <CodeRunner
                    onRequestFix={onRequestFix}
                    language={language}
                    code={code}
                    key={refresh}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
