"use client";
import React from "react";
import Image from "next/image";

const QUIZ_TOKEN = {
  name: "$QUIZ",
  marketCap: "35625.99",
  holders: "2",
  volume24h: "12.57",
  address: "0x6a81...d99c",
  creator: "0xchristopher",
  totalSupply: "1000000000",
  dateCreated: "19 Jun 2025",
  about:
    "QUIZ is the ultimate trivia token. Play, earn, and challenge your friends! Mint ends 6/2 10:00pm ET. 1,000,000,000 max supply. $QUIZ will power the next generation of on-chain quizzes.",
};

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

function truncateAddress(addr: string) {
  if (addr.length <= 12) return addr;
  const [start, end] = addr.split("...");
  if (start && end) return `${start}...${end}`;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function TokenDrawer() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [buyAmount, setBuyAmount] = React.useState("");
  const suggested = ["0.001", "0.005", "0.02"];

  const handleCopy = () => {
    copyToClipboard(QUIZ_TOKEN.address.replace("...", ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <>
      {/* Drawer Tab */}
      <button
        className={`fixed left-0 top-1/2 z-30 flex flex-col items-center justify-center gap-1 rounded-r-xl bg-bubblegumPink px-6 py-4 font-heading text-lg font-extrabold uppercase tracking-wider text-plumPurple shadow-xl transition-all hover:bg-lemonYellow ${open ? "hidden" : ""}`}
        style={{ minWidth: 100, minHeight: 90, transform: "translateY(-50%)" }}
        onClick={() => setOpen(true)}
        aria-label="Open $QUIZ drawer"
      >
        <Image src="/coin.svg" alt="$QUIZ Coin" width={36} height={36} />
        <span>{QUIZ_TOKEN.name}</span>
      </button>
      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-80 transform bg-white transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ borderTopRightRadius: 16, borderBottomRightRadius: 16 }}
      >
        <div className="flex items-center justify-between border-b border-bubblegumPink px-4 py-3">
          <span className="font-heading text-xl text-plumPurple">
            {QUIZ_TOKEN.name} Token
          </span>
          <button
            className="ml-2 p-1 text-plumPurple hover:text-plumPurple/80 focus:outline-none"
            onClick={() => setOpen(false)}
            aria-label="Close drawer"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-6 p-4">
          {/* Pills Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Market Cap */}
            <div className="flex min-h-[100px] flex-col items-center rounded-[28px] bg-lemonYellow/60 px-6 py-5">
              <span className="mb-1 font-heading text-xs font-bold uppercase tracking-wider text-plumPurple">
                MARKET CAP
              </span>
              <span className="font-body text-3xl font-extrabold text-plumPurple">
                {QUIZ_TOKEN.marketCap}
              </span>
            </div>
            {/* Holders */}
            <div className="flex min-h-[100px] flex-col items-center rounded-[28px] bg-bubblegumPink/30 px-6 py-5">
              <span className="mb-1 font-heading text-xs font-bold uppercase tracking-wider text-plumPurple">
                HOLDERS
              </span>
              <span className="font-body text-3xl font-extrabold text-plumPurple">
                {QUIZ_TOKEN.holders}
              </span>
            </div>
            {/* 24h Volume */}
            <div className="flex min-h-[100px] flex-col items-center rounded-[28px] bg-mintGreen/10 px-6 py-5">
              <span className="mb-1 font-heading text-xs font-bold uppercase tracking-wider text-plumPurple">
                24H VOLUME
              </span>
              <span className="font-body text-3xl font-extrabold text-plumPurple">
                {QUIZ_TOKEN.volume24h}
              </span>
            </div>
            {/* Address */}
            <div className="flex min-h-[100px] flex-col items-center rounded-[28px] bg-lemonYellow/30 px-6 py-5">
              <span className="mb-1 font-heading text-xs font-bold uppercase tracking-wider text-plumPurple">
                ADDRESS
              </span>
              <span className="mb-2 max-w-[110px] truncate font-body font-mono text-xs text-plumPurple">
                {truncateAddress(QUIZ_TOKEN.address)}
              </span>
              <button
                className="mt-1 rounded bg-mintGreen px-4 py-1 font-body text-sm font-semibold text-white"
                onClick={handleCopy}
                aria-label="Copy address"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          {/* Created by */}
          <div className="mt-2 flex items-center gap-2 font-body text-sm text-plumPurple/70">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="7" r="4" stroke="#a3a3a3" strokeWidth="2" />
              <path
                d="M4 21c0-3.314 3.134-6 7-6s7 2.686 7 6"
                stroke="#a3a3a3"
                strokeWidth="2"
              />
            </svg>
            <span className="font-heading font-semibold">Created by</span>
            <span className="ml-1 font-body font-extrabold text-plumPurple">
              {QUIZ_TOKEN.creator}
            </span>
          </div>
          {/* Total Supply & Date Created */}
          <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-softPeach px-4 py-3 font-body">
            <div className="flex justify-between text-base">
              <span className="font-heading font-bold text-plumPurple">
                Total Supply:
              </span>
              <span className="font-extrabold text-plumPurple">
                {QUIZ_TOKEN.totalSupply}
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span className="font-heading font-bold text-plumPurple">
                Date Created:
              </span>
              <span className="font-extrabold text-plumPurple">
                {QUIZ_TOKEN.dateCreated}
              </span>
            </div>
          </div>
          {/* About */}
          <div className="mt-2 rounded-2xl bg-bubblegumPink/10 px-4 py-3">
            <div className="mb-1 font-heading font-bold text-plumPurple">
              About {QUIZ_TOKEN.name}
            </div>
            <div className="whitespace-pre-line font-body text-sm text-plumPurple">
              {QUIZ_TOKEN.about}
            </div>
          </div>
        </div>
        {/* Buy Section */}
        <div className="mt-auto flex flex-col gap-2 px-4 pb-6 pt-2">
          <label
            htmlFor="buy-amount"
            className="mb-1 font-heading text-sm text-plumPurple"
          >
            Buy {QUIZ_TOKEN.name} (ETH)
          </label>
          <input
            id="buy-amount"
            type="number"
            min="0"
            step="any"
            placeholder="Amount in ETH"
            className="w-full rounded-lg border border-mintGreen bg-white px-3 py-2 font-body text-base text-plumPurple focus:outline-none focus:ring-2 focus:ring-mintGreen"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
          />
          <div className="mb-2 flex gap-2">
            {suggested.map((amt) => (
              <button
                key={amt}
                type="button"
                className={`rounded-full border px-3 py-1 font-heading text-sm font-bold transition-colors ${buyAmount === amt ? "border-mintGreen bg-mintGreen text-white" : "border-softPeach bg-softPeach text-plumPurple hover:bg-mintGreen/20"}`}
                onClick={() => setBuyAmount(amt)}
              >
                {amt}
              </button>
            ))}
          </div>
          <button className="mt-2 w-full rounded-lg bg-mintGreen px-4 py-2 font-heading text-lg font-bold text-white transition-colors hover:bg-bubblegumPink">
            Buy
          </button>
        </div>
      </div>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/10"
          onClick={() => setOpen(false)}
          aria-label="Close drawer overlay"
        />
      )}
    </>
  );
}
