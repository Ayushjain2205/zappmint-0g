/* eslint-disable @next/next/no-img-element */
"use client";

import LightningBoltIcon from "@/components/icons/lightning-bolt";
import LightbulbIcon from "@/components/icons/lightbulb";
import Spinner from "@/components/spinner";
import * as Select from "@radix-ui/react-select";
import assert from "assert";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState, useRef, useTransition, useEffect } from "react";
import { createChat, getAllChats } from "./actions";
import { Context } from "./providers";
import { useS3Upload } from "next-s3-upload";
import UploadIcon from "@/components/icons/upload-icon";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { MODELS, SUGGESTED_PROMPTS } from "@/lib/constants";
import { ZappCard, ZappIcons, ZappProject } from "@/components/ZappCard";
import UnifiedNavbar from "@/components/unified-navbar";
import { useActiveAccount } from "thirdweb/react";
import StreaksPopup from "@/components/StreaksPopup";
import {
  updateStreak,
  shouldShowStreakPopup,
  markStreakPopupShown,
} from "@/lib/streaks";

// Add type for Chat
interface Chat {
  id: string;
  model: string;
  quality: string;
  prompt: string;
  title: string;
  createdAt: string;
}

export default function Home() {
  const { setStreamPromise } = use(Context);
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(MODELS[0].value);
  const [quality, setQuality] = useState("high");
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(
    undefined,
  );
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const selectedModel = MODELS.find((m) => m.value === model);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const [isStarting, setIsStarting] = useState(false);
  const loadingMessages = [
    "Coming up with a blueprint...",
    "Writing code...",
    "Deploying your app...",
    "Almost done...",
  ];
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isStarting) {
      setLoadingMessageIndex(0);
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          } else {
            // Stop at the last message
            if (interval) clearInterval(interval);
            return prev;
          }
        });
      }, 7000); // 7 seconds
    } else {
      setLoadingMessageIndex(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStarting, loadingMessages.length]);

  const { uploadToS3 } = useS3Upload();
  const handleScreenshotUpload = async (event: any) => {
    if (prompt.length === 0) setPrompt("Build this");
    setQuality("low");
    setScreenshotLoading(true);
    let file = event.target.files[0];
    const { url } = await uploadToS3(file);
    setScreenshotUrl(url);
    setScreenshotLoading(false);
  };

  const textareaResizePrompt = prompt
    .split("\n")
    .map((text) => (text === "" ? "a" : text))
    .join("\n");

  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Wallet connection and streaks
  const account = useActiveAccount();
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [hasCheckedWallet, setHasCheckedWallet] = useState(false);

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

  // Handle wallet connection and streaks
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if wallet is connected
    const isWalletConnected = !!account;
    const wasWalletConnected = localStorage.getItem(
      "zappmint_wallet_connected",
    );

    if (isWalletConnected && !hasCheckedWallet) {
      setHasCheckedWallet(true);

      // Check if this is first wallet connection (never connected before)
      const isFirstConnection = !wasWalletConnected;

      // Update streak
      const currentStreak = updateStreak();
      setStreakDays(currentStreak);

      // Mark wallet as connected
      localStorage.setItem("zappmint_wallet_connected", "true");

      // Check if we should show popup
      // Show on first connection OR if user has a streak and hasn't seen popup today
      if (shouldShowStreakPopup(isFirstConnection)) {
        setShowStreakPopup(true);
        markStreakPopupShown();
      }
    } else if (!isWalletConnected) {
      // Reset check flag when wallet disconnects
      setHasCheckedWallet(false);
    }
  }, [account, hasCheckedWallet]);

  return (
    <div className="bg-softPeach font-body text-plumPurple">
      {/* Streaks Popup */}
      <StreaksPopup
        isOpen={showStreakPopup}
        onClose={() => setShowStreakPopup(false)}
        streakDays={streakDays}
      />

      {/* Unified Navbar */}
      <UnifiedNavbar />

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-20 pt-32">
        {/* Decorative Cranes */}
        <img
          src="/crane-left.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 z-0 hidden w-[300px] max-w-none -translate-y-1/2 select-none sm:block"
          style={{ minHeight: 400 }}
        />
        <img
          src="/crane-right.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 z-0 hidden w-[350px] max-w-none select-none sm:block"
          style={{ minHeight: 500 }}
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-bubblegumPink/20 via-lemonYellow/10 to-transparent" />

        <div className="container relative z-20 mx-auto max-w-4xl text-center">
          {/* Hero Heading with Coin */}
          <div className="relative inline-block w-full">
            <h1 className="mb-12 font-heading text-5xl font-bold md:text-7xl">
              <span className="font-heading text-plumPurple">Coin your </span>
              <span className="font-sketch">idea</span>
              <br className="mb-4" />
              <span className="font-heading text-plumPurple">into a </span>
              <span className="font-sketch">$zapp</span>
            </h1>
            {/* Decorative Coin Image absolutely positioned to h1 */}
            <img
              src="/coin.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-1/4 top-1/2 z-10 hidden -translate-y-1/2 translate-x-3/4 opacity-90 sm:block sm:w-[100px] sm:max-w-[100px]"
            />
          </div>

          {/* Prompt Box */}
          <form
            className="relative z-20 mx-auto max-w-3xl"
            onSubmit={async (e) => {
              e.preventDefault();
              setIsStarting(true);
              const formData = new FormData(e.currentTarget);
              const prompt = formData.get("prompt");
              const model = formData.get("model");
              const quality = formData.get("quality");

              assert.ok(typeof prompt === "string");
              assert.ok(typeof model === "string");
              assert.ok(quality === "high" || quality === "low");

              const { chatId, lastMessageId } = await createChat(
                prompt,
                model,
                quality,
                screenshotUrl,
              );

              const streamPromise = fetch(
                "/api/get-next-completion-stream-promise",
                {
                  method: "POST",
                  body: JSON.stringify({ messageId: lastMessageId, model }),
                },
              ).then((res) => {
                if (!res.body) {
                  throw new Error("No body on response");
                }
                return res.body;
              });

              setStreamPromise(streamPromise);
              router.push(`/chats/${chatId}`);
            }}
          >
            {/* Glow and heat distortion overlays behind prompt box */}
            <div
              className="pointer-events-none absolute -inset-6 z-10 rounded-xl bg-gradient-to-r from-bubblegumPink/30 to-lemonYellow/30 opacity-70 blur-xl"
              style={{ zIndex: 10 }}
            ></div>
            <div
              className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-gradient-to-b from-bubblegumPink/5 to-transparent opacity-30"
              style={{ zIndex: 10 }}
            ></div>
            <div className="relative z-20 mb-8 flex flex-col items-center justify-center rounded-2xl border border-bubblegumPink bg-white/90 p-8 shadow-lg backdrop-blur-md">
              {/* Optional: Add a soft colored glow behind the box for pop */}
              <div className="pointer-events-none absolute -inset-2 z-0 rounded-2xl bg-gradient-to-br from-lemonYellow/20 via-bubblegumPink/10 to-mintGreen/10 blur-lg" />
              <div className="relative z-10 flex w-full flex-col">
                <textarea
                  placeholder="Describe your app idea in detail..."
                  required
                  name="prompt"
                  rows={4}
                  className="min-h-[120px] w-full resize-none rounded-xl border border-bubblegumPink bg-softPeach p-4 font-display text-lg text-plumPurple shadow-sm transition placeholder:text-bubblegumPink focus-visible:border-lemonYellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bubblegumPink/70 disabled:opacity-50"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      const target = event.target;
                      if (!(target instanceof HTMLTextAreaElement)) return;
                      target.closest("form")?.requestSubmit();
                    }
                  }}
                />
                {isStarting && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-white px-1 py-3 md:px-3">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                      <span className="animate-pulse text-balance text-center text-sm text-bubblegumPink md:text-base">
                        {loadingMessages[loadingMessageIndex]}
                      </span>
                    </div>
                  </div>
                )}
                {/* Screenshot preview */}
                {screenshotLoading && (
                  <div className="relative z-20 mx-3 mt-3">
                    <div className="rounded-xl">
                      <div className="group mb-2 flex h-16 w-[68px] animate-pulse items-center justify-center rounded bg-gray-200">
                        <Spinner />
                      </div>
                    </div>
                  </div>
                )}
                {screenshotUrl && (
                  <div className={`relative z-20 mx-3 mt-3`}>
                    <div className="rounded-xl">
                      <img
                        alt="screenshot"
                        src={screenshotUrl}
                        className="group relative mb-2 h-16 w-[68px] rounded"
                      />
                    </div>
                    <button
                      type="button"
                      id="x-circle-icon"
                      className="absolute -right-3 -top-4 left-14 z-30 size-5 rounded-full bg-white text-gray-900 hover:text-gray-500"
                      onClick={() => {
                        setScreenshotUrl(undefined);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <XCircleIcon />
                    </button>
                  </div>
                )}
              </div>
              <div className="z-20 mt-4 flex w-full flex-col gap-4 border-t border-bubblegumPink pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Select.Root
                    name="model"
                    value={model}
                    onValueChange={setModel}
                  >
                    <Select.Trigger
                      className="z-30 inline-flex w-[180px] items-center gap-1 rounded-md border-none bg-transparent p-1 font-display text-sm text-gray-400 hover:bg-zinc-900/10 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300"
                      tabIndex={0}
                      style={{ zIndex: 30 }}
                    >
                      <Select.Value aria-label={model}>
                        <span className="font-display">
                          {selectedModel?.label}
                        </span>
                      </Select.Value>
                      <Select.Icon>
                        <ChevronDownIcon className="size-3" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="z-50 overflow-hidden rounded-md border-zinc-700 bg-zinc-900 shadow ring-1 ring-black/5">
                        <Select.Viewport className="space-y-1 p-2">
                          {MODELS.map((m) => (
                            <Select.Item
                              key={m.value}
                              value={m.value}
                              className="flex cursor-pointer items-center gap-1 rounded-md p-1 font-display text-sm transition-colors data-[highlighted]:bg-lemonYellow/90 data-[highlighted]:font-bold data-[highlighted]:text-plumPurple data-[highlighted]:outline-none"
                            >
                              <Select.ItemText className="inline-flex items-center gap-2 font-display text-bubblegumPink">
                                {m.label}
                              </Select.ItemText>
                              <Select.ItemIndicator>
                                <CheckIcon className="size-3 text-mintGreen" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton />
                        <Select.Arrow />
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  <div className="h-4 w-px bg-bubblegumPink max-sm:hidden" />
                  <Select.Root
                    name="quality"
                    value={quality}
                    onValueChange={setQuality}
                  >
                    <Select.Trigger
                      className="z-30 inline-flex items-center gap-1 rounded p-1 font-display text-sm text-gray-400 hover:bg-zinc-900/80 hover:text-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300"
                      tabIndex={0}
                      style={{ zIndex: 30 }}
                    >
                      <Select.Value aria-label={quality}>
                        <span className="font-display max-sm:hidden">
                          {quality === "low"
                            ? "Low quality [faster]"
                            : "High quality [slower]"}
                        </span>
                        <span className="sm:hidden">
                          <LightningBoltIcon className="size-3" />
                        </span>
                      </Select.Value>
                      <Select.Icon>
                        <ChevronDownIcon className="size-3" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="z-50 overflow-hidden rounded-md bg-zinc-900 shadow ring-1 ring-black/5">
                        <Select.Viewport className="space-y-1 p-2">
                          {[
                            { value: "low", label: "Low quality [faster]" },
                            {
                              value: "high",
                              label: "High quality [slower]",
                            },
                          ].map((q) => (
                            <Select.Item
                              key={q.value}
                              value={q.value}
                              className="flex cursor-pointer items-center gap-1 rounded-md p-1 font-display text-sm transition-colors data-[highlighted]:bg-lemonYellow/90 data-[highlighted]:font-bold data-[highlighted]:text-plumPurple data-[highlighted]:outline-none"
                            >
                              <Select.ItemText className="inline-flex items-center gap-2 font-display text-bubblegumPink">
                                {q.label}
                              </Select.ItemText>
                              <Select.ItemIndicator>
                                <CheckIcon className="size-3 text-mintGreen" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton />
                        <Select.Arrow />
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  <div className="h-4 w-px bg-bubblegumPink max-sm:hidden" />
                  <div>
                    <label
                      htmlFor="screenshot"
                      className="z-30 flex cursor-pointer gap-2 font-display text-sm text-gray-400 hover:underline"
                      style={{ zIndex: 30 }}
                    >
                      <div className="flex size-6 items-center justify-center rounded bg-lemonYellow hover:bg-bubblegumPink/40">
                        <UploadIcon className="size-4" />
                      </div>
                      <div className="flex items-center justify-center font-display transition hover:text-bubblegumPink">
                        Attach
                      </div>
                    </label>
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                </div>
                <div className="relative z-20 flex shrink-0 items-center gap-3 has-[:disabled]:opacity-50">
                  <div className="group relative">
                    <button
                      type="button"
                      onClick={() => {
                        // TODO: Implement enhance prompt functionality
                        console.log("Enhance prompt clicked");
                      }}
                      className="flex size-8 items-center justify-center rounded bg-transparent p-1 font-display text-sm text-gray-400 hover:bg-zinc-900/10 hover:text-gray-700 focus-visible:outline-none"
                      disabled={isStarting}
                    >
                      <LightbulbIcon className="size-4" />
                    </button>
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Enhance prompt
                      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-3 rounded-2xl border-2 border-plumPurple bg-bubblegumPink px-8 py-4 font-heading text-xl font-bold text-plumPurple shadow-lg transition-all duration-200 hover:bg-lemonYellow hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lemonYellow"
                    style={{ minWidth: 180 }}
                    disabled={isStarting}
                  >
                    <LightningBoltIcon className="h-7 w-7 text-plumPurple" />
                    {isStarting ? "Starting..." : "Zapp it"}
                  </button>
                </div>
              </div>
              {isPending && (
                <LoadingMessage
                  isHighQuality={quality === "high"}
                  screenshotUrl={screenshotUrl}
                />
              )}
              {/* Molten metal effect at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-2 animate-pulse bg-gradient-to-r from-lemonYellow via-bubblegumPink to-lemonYellow"></div>
            </div>
            {/* Suggestion Chips */}
            <div className="relative z-30 mb-6 flex flex-wrap justify-center gap-2">
              {SUGGESTED_PROMPTS.map((v) => (
                <button
                  key={v.title}
                  type="button"
                  onClick={() => setPrompt(v.description)}
                  className="z-30 flex items-center gap-1.5 rounded-full border border-bubblegumPink bg-softPeach/70 px-3 py-1.5 font-display text-sm text-plumPurple transition-colors hover:bg-bubblegumPink/20"
                  style={{ zIndex: 30 }}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* Top Zapps Section */}
      <section className="relative z-20 flex flex-col px-4 py-20">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-5xl font-bold text-plumPurple">
              Top Zapps ⭐
            </h2>
            <p className="mb-8 text-lg text-plumPurple/80">
              Discover the most popular and trending Zapps built by the
              <br />
              community
            </p>
          </div>

          {loadingApps ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : chats.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-plumPurple/60">
                No zapps yet. Create one above!
              </p>
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
                      description: chat.prompt.slice(0, 100),
                      createdAt: chat.createdAt,
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function LoadingMessage({
  isHighQuality,
  screenshotUrl,
}: {
  isHighQuality: boolean;
  screenshotUrl: string | undefined;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white px-1 py-3 md:px-3">
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
        <span className="animate-pulse text-balance text-center text-sm text-bubblegumPink md:text-base">
          {isHighQuality
            ? `Coming up with project plan, may take 15 seconds...`
            : screenshotUrl
              ? "Analyzing your screenshot..."
              : `Creating your app...`}
        </span>
        <Spinner />
      </div>
    </div>
  );
}

export const runtime = "edge";
export const maxDuration = 45;
