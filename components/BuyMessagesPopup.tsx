"use client";
import React, { useState } from "react";

interface BuyMessagesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (messages: number, price: number) => Promise<void>;
}

const MESSAGE_PACKAGES = [
  { messages: 10, price: 1, label: "10 messages" },
  { messages: 25, price: 2, label: "25 messages" },
  { messages: 60, price: 4, label: "50 messages" },
];

export default function BuyMessagesPopup({
  isOpen,
  onClose,
  onPurchase,
}: BuyMessagesPopupProps) {
  const [selectedPackage, setSelectedPackage] = useState<
    (typeof MESSAGE_PACKAGES)[0] | null
  >(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    if (!selectedPackage || isPurchasing) return;

    setIsPurchasing(true);
    try {
      await onPurchase(selectedPackage.messages, selectedPackage.price);
      setSelectedPackage(null);
      onClose();
    } catch (error) {
      console.error("Purchase failed:", error);
      // You might want to show an error toast here
    } finally {
      setIsPurchasing(false);
    }
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
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl md:max-h-[85vh] md:w-full md:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-bubblegumPink pb-3 md:pb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-plumPurple md:text-2xl">
              Buy Messages
            </h2>
            <p className="font-body text-xs text-plumPurple/70 md:text-sm">
              Choose a package to get more messages
            </p>
          </div>
          <button
            className="touch-manipulation p-1 text-plumPurple hover:text-plumPurple/80 focus:outline-none"
            onClick={onClose}
            aria-label="Close popup"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:h-7 md:w-7"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Package Selection */}
        <div className="mb-4 flex flex-col gap-3">
          {MESSAGE_PACKAGES.map((pkg) => (
            <button
              key={pkg.messages}
              type="button"
              onClick={() => setSelectedPackage(pkg)}
              className={`touch-manipulation rounded-xl border-4 p-4 text-left transition-all ${
                selectedPackage?.messages === pkg.messages
                  ? "border-bubblegumPink bg-bubblegumPink/20 shadow-lg"
                  : "border-softPeach bg-white hover:border-bubblegumPink/50 hover:bg-bubblegumPink/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-1 font-heading text-base font-bold text-plumPurple md:text-lg">
                    {pkg.label}
                  </div>
                  <div className="font-body text-sm text-plumPurple/70">
                    {pkg.price} 0G tokens
                  </div>
                </div>
                <div
                  className={`flex size-6 items-center justify-center rounded-full border-2 ${
                    selectedPackage?.messages === pkg.messages
                      ? "border-bubblegumPink bg-bubblegumPink"
                      : "border-plumPurple/30"
                  }`}
                >
                  {selectedPackage?.messages === pkg.messages && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Purchase Button */}
        <button
          className="mt-4 w-full touch-manipulation rounded-lg bg-mintGreen px-4 py-4 font-heading text-base font-bold text-white transition-colors disabled:bg-plumPurple/30 disabled:text-plumPurple/50 md:py-3 md:text-lg md:hover:bg-bubblegumPink"
          onClick={handlePurchase}
          disabled={!selectedPackage || isPurchasing}
        >
          {isPurchasing
            ? "Processing..."
            : `Purchase ${selectedPackage?.messages || ""} messages`}
        </button>
      </div>
    </>
  );
}
