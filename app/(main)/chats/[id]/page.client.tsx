"use client";

import { createMessage } from "@/app/(main)/actions";
import { splitByFirstCodeFence } from "@/lib/utils";
import UnifiedNavbar from "@/components/unified-navbar";
import { useRouter } from "next/navigation";
import { startTransition, use, useEffect, useRef, useState } from "react";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream.mjs";
import ChatBox from "./chat-box";
import ChatLog from "./chat-log";
import CodeViewer from "./code-viewer";
import CodeViewerLayout from "./code-viewer-layout";
import type { Chat } from "./page";
import { Context } from "../../providers";
import BuyMessagesPopup from "@/components/BuyMessagesPopup";
import { getMessagesAvailable, addMessages } from "@/lib/messages";
import { useActiveAccount } from "thirdweb/react";
import { MessageSquare } from "lucide-react";

export default function PageClient({ chat }: { chat: Chat }) {
  const context = use(Context);
  const [streamPromise, setStreamPromise] = useState<
    Promise<ReadableStream> | undefined
  >(context.streamPromise);
  const [streamText, setStreamText] = useState("");
  const [isShowingCodeViewer, setIsShowingCodeViewer] = useState(
    chat.messages.some((m) => m.role === "assistant"),
  );
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
  const router = useRouter();
  const isHandlingStreamRef = useRef(false);
  const [activeMessage, setActiveMessage] = useState(
    chat.messages.filter((m) => m.role === "assistant").at(-1),
  );
  const [messagesAvailable, setMessagesAvailableState] = useState(0);
  const [showBuyMessagesPopup, setShowBuyMessagesPopup] = useState(false);
  const account = useActiveAccount();

  // Initialize and sync messages available count
  useEffect(() => {
    setMessagesAvailableState(getMessagesAvailable());

    // Listen for message count updates
    const handleMessagesUpdated = () => {
      setMessagesAvailableState(getMessagesAvailable());
    };
    window.addEventListener("messagesUpdated", handleMessagesUpdated);

    return () => {
      window.removeEventListener("messagesUpdated", handleMessagesUpdated);
    };
  }, []);

  useEffect(() => {
    async function f() {
      if (!streamPromise || isHandlingStreamRef.current) return;

      isHandlingStreamRef.current = true;
      context.setStreamPromise(undefined);

      const stream = await streamPromise;
      let didPushToCode = false;
      let didPushToPreview = false;

      ChatCompletionStream.fromReadableStream(stream)
        .on("content", (delta, content) => {
          setStreamText((text) => text + delta);

          if (
            !didPushToCode &&
            splitByFirstCodeFence(content).some(
              (part) => part.type === "first-code-fence-generating",
            )
          ) {
            didPushToCode = true;
            setIsShowingCodeViewer(true);
            setActiveTab("code");
          }

          if (
            !didPushToPreview &&
            splitByFirstCodeFence(content).some(
              (part) => part.type === "first-code-fence",
            )
          ) {
            didPushToPreview = true;
            setIsShowingCodeViewer(true);
            setActiveTab("preview");
          }
        })
        .on("finalContent", async (finalText) => {
          startTransition(async () => {
            const message = await createMessage(
              chat.id,
              finalText,
              "assistant",
            );

            startTransition(() => {
              isHandlingStreamRef.current = false;
              setStreamText("");
              setStreamPromise(undefined);
              setActiveMessage(message);
              router.refresh();
            });
          });
        });
    }

    f();
  }, [chat.id, router, streamPromise, context]);

  const handlePurchaseMessages = async (messages: number, price: number) => {
    if (!account) {
      alert("Please connect your wallet to purchase messages");
      return;
    }

    try {
      // Call API to purchase messages
      const response = await fetch("/api/buy-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          price,
          walletAddress: account.address,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to purchase messages");
      }

      const data = await response.json();

      // Update local storage and state
      addMessages(messages);
      const newCount = getMessagesAvailable();
      setMessagesAvailableState(newCount);

      // Show success message
      alert(`Successfully purchased ${messages} messages!`);
    } catch (error) {
      console.error("Error purchasing messages:", error);
      throw error;
    }
  };

  return (
    <div className="h-dvh">
      <UnifiedNavbar />
      <div className="flex h-full pt-[44px]">
        <div className="mx-auto flex w-full shrink-0 flex-col overflow-hidden lg:w-1/2">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <p className="font-heading font-semibold text-plumPurple">
              {chat.title}
            </p>
            <button
              onClick={() => setShowBuyMessagesPopup(true)}
              className="flex touch-manipulation items-center gap-2 rounded-lg border-2 border-bubblegumPink bg-white px-3 py-1.5 font-heading text-sm font-semibold text-plumPurple transition-colors hover:bg-bubblegumPink/20"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{messagesAvailable}</span>
            </button>
          </div>

          <ChatLog
            chat={chat}
            streamText={streamText}
            activeMessage={activeMessage}
            onMessageClick={(message) => {
              if (message !== activeMessage) {
                setActiveMessage(message);
                setIsShowingCodeViewer(true);
              } else {
                setActiveMessage(undefined);
                setIsShowingCodeViewer(false);
              }
            }}
          />

          <ChatBox
            chat={chat}
            onNewStreamPromise={setStreamPromise}
            isStreaming={!!streamPromise}
          />
        </div>

        <CodeViewerLayout
          isShowing={isShowingCodeViewer}
          onClose={() => {
            setActiveMessage(undefined);
            setIsShowingCodeViewer(false);
          }}
        >
          {isShowingCodeViewer && (
            <CodeViewer
              streamText={streamText}
              chat={chat}
              message={activeMessage}
              onMessageChange={setActiveMessage}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onClose={() => {
                setActiveMessage(undefined);
                setIsShowingCodeViewer(false);
              }}
              onRequestFix={(error: string) => {
                startTransition(async () => {
                  let newMessageText = `The code is not working. Can you fix it? Here's the error:\n\n`;
                  newMessageText += error.trimStart();
                  const message = await createMessage(
                    chat.id,
                    newMessageText,
                    "user",
                  );

                  const streamPromise = fetch(
                    "/api/get-next-completion-stream-promise",
                    {
                      method: "POST",
                      body: JSON.stringify({
                        messageId: message.id,
                        model: chat.model,
                      }),
                    },
                  ).then((res) => {
                    if (!res.body) {
                      throw new Error("No body on response");
                    }
                    return res.body;
                  });
                  setStreamPromise(streamPromise);
                  router.refresh();
                });
              }}
            />
          )}
        </CodeViewerLayout>
      </div>

      <BuyMessagesPopup
        isOpen={showBuyMessagesPopup}
        onClose={() => setShowBuyMessagesPopup(false)}
        onPurchase={handlePurchaseMessages}
      />
    </div>
  );
}
