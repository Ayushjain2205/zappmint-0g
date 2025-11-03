"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Token {
  name: string;
  price: string;
  holders: string;
  address: string;
  marketCap?: string;
  volume24h?: string;
  creator?: string;
  totalSupply?: string;
  dateCreated?: string;
  about?: string;
}

interface BuyTokenPopupProps {
  token: Token;
  isOpen: boolean;
  onClose: () => void;
}

function truncateAddress(addr: string) {
  if (addr.length <= 12) return addr;
  const [start, end] = addr.split("...");
  if (start && end) return `${start}...${end}`;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function BuyTokenPopup({
  token,
  isOpen,
  onClose,
}: BuyTokenPopupProps) {
  const [buyAmount, setBuyAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const suggested = ["0.001", "0.005", "0.02"];

  if (!isOpen) return null;

  const handleCopy = () => {
    const fullAddress = token.address.includes("...")
      ? token.address.replace("...", "")
      : token.address;
    copyToClipboard(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleBuy = () => {
    // TODO: Implement actual buy logic
    console.log(`Buying ${buyAmount} ETH worth of ${token.name}`);
    // After successful buy, you might want to close the popup or show success message
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close popup"
      />

      {/* Popup */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-bubblegumPink pb-4">
          <div className="flex items-center gap-3">
            <Image src="/coin.svg" alt={token.name} width={40} height={40} />
            <div>
              <h2 className="font-heading text-2xl font-bold text-plumPurple">
                {token.name} Token
              </h2>
              {token.price && (
                <p className="font-body text-sm text-plumPurple/70">
                  Price: {token.price} ETH
                </p>
              )}
            </div>
          </div>
          <button
            className="p-1 text-plumPurple hover:text-plumPurple/80 focus:outline-none"
            onClick={onClose}
            aria-label="Close popup"
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

        {/* Token Info Grid */}
        {token.marketCap && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            {token.marketCap && (
              <div className="flex min-h-[80px] flex-col items-center justify-center rounded-xl bg-lemonYellow/60 px-4 py-3">
                <span className="mb-1 font-heading text-xs font-bold uppercase tracking-wider text-plumPurple">
                  MARKET CAP
                </span>
                <span className="font-body text-xl font-extrabold text-plumPurple">
                  {token.marketCap}
                </span>
              </div>
            )}
            {token.holders && (
              <div className="flex min-h-[80px] flex-col items-center justify-center rounded-xl bg-bubblegumPink/30 px-4 py-3">
                <span className="mb-1 font-heading text-xs font-bold uppercase tracking-wider text-plumPurple">
                  HOLDERS
                </span>
                <span className="font-body text-xl font-extrabold text-plumPurple">
                  {token.holders}
                </span>
              </div>
            )}
            {token.volume24h && (
              <div className="flex min-h-[80px] flex-col items-center justify-center rounded-xl bg-mintGreen/10 px-4 py-3">
                <span className="mb-1 font-heading text-xs font-bold uppercase tracking-wider text-plumPurple">
                  24H VOLUME
                </span>
                <span className="font-body text-xl font-extrabold text-plumPurple">
                  {token.volume24h}
                </span>
              </div>
            )}
            <div className="flex min-h-[80px] flex-col items-center justify-center rounded-xl bg-lemonYellow/30 px-4 py-3">
              <span className="mb-1 font-heading text-xs font-bold uppercase tracking-wider text-plumPurple">
                ADDRESS
              </span>
              <span className="mb-2 max-w-[110px] truncate font-mono text-xs text-plumPurple">
                {truncateAddress(token.address)}
              </span>
              <button
                className="mt-1 rounded bg-mintGreen px-3 py-1 font-body text-xs font-semibold text-white"
                onClick={handleCopy}
                aria-label="Copy address"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* Created by */}
        {token.creator && (
          <div className="mb-4 flex items-center gap-2 font-body text-sm text-plumPurple/70">
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
              {token.creator}
            </span>
          </div>
        )}

        {/* About */}
        {token.about && (
          <div className="mb-4 rounded-xl bg-bubblegumPink/10 px-4 py-3">
            <div className="mb-1 font-heading font-bold text-plumPurple">
              About {token.name}
            </div>
            <div className="whitespace-pre-line font-body text-sm text-plumPurple">
              {token.about}
            </div>
          </div>
        )}

        {/* Buy Section */}
        <div className="flex flex-col gap-2 border-t border-softPeach pt-4">
          <label
            htmlFor="buy-amount"
            className="font-heading text-sm font-bold text-plumPurple"
          >
            Buy {token.name} (ETH)
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
                className={`rounded-full border px-3 py-1 font-heading text-sm font-bold transition-colors ${
                  buyAmount === amt
                    ? "border-mintGreen bg-mintGreen text-white"
                    : "border-softPeach bg-softPeach text-plumPurple hover:bg-mintGreen/20"
                }`}
                onClick={() => setBuyAmount(amt)}
              >
                {amt}
              </button>
            ))}
          </div>
          <button
            className="mt-2 w-full rounded-lg bg-mintGreen px-4 py-3 font-heading text-lg font-bold text-white transition-colors hover:bg-bubblegumPink"
            onClick={handleBuy}
            disabled={!buyAmount || parseFloat(buyAmount) <= 0}
          >
            Buy {token.name}
          </button>
        </div>
      </div>
    </>
  );
}
