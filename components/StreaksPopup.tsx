"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { X, Check, Gift } from "lucide-react";
import {
  REWARD_TIERS,
  getCurrentRewardTier,
  getNextRewardTier,
  getProgressToNextTier,
} from "@/lib/streaks";

interface StreaksPopupProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
}

export default function StreaksPopup({
  isOpen,
  onClose,
  streakDays,
}: StreaksPopupProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.9),
            y: Math.random() - 0.2,
          },
          colors: [
            "#FFEB78", // lemonYellow
            "#F78DA7", // bubblegumPink
            "#90D8F6", // skyBlue
            "#4C1B3F", // plumPurple
            "#A8E6CF", // mintGreen
          ],
        });
      }, 250);

      // Cleanup interval on unmount or when popup closes
      return () => {
        clearInterval(interval);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-2xl border-2 border-bubblegumPink bg-softPeach p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-plumPurple transition-colors hover:bg-bubblegumPink/20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Fire emoji or streak icon */}
          <div className="mb-4 text-6xl">{streakDays > 0 ? "🔥" : "✨"}</div>

          {/* Title */}
          <h2 className="mb-6 font-heading text-3xl font-bold text-plumPurple">
            {streakDays > 0
              ? `You're on a ${streakDays} day streak!`
              : "Welcome back!"}
          </h2>

          {/* Rewards Section */}
          <RewardsSection streakDays={streakDays} />

          {/* Continue button */}
          <button
            onClick={onClose}
            className="w-full rounded-xl border-2 border-plumPurple bg-bubblegumPink px-6 py-3 font-heading text-lg font-bold text-plumPurple transition-all hover:bg-lemonYellow hover:shadow-lg"
          >
            Continue Building
          </button>
        </div>
      </div>
    </div>
  );
}

function RewardsSection({ streakDays }: { streakDays: number }) {
  const currentTier = getCurrentRewardTier(streakDays);
  const { progress } = getProgressToNextTier(streakDays);

  return (
    <div className="mb-6 w-full">
      <div className="mb-6 flex items-center justify-center gap-2">
        <Gift className="h-5 w-5 text-bubblegumPink" />
        <h3 className="font-heading text-xl font-bold text-plumPurple">
          Rewards Roadmap
        </h3>
      </div>

      {/* Roadmap Style Rewards */}
      <div className="space-y-3">
        {REWARD_TIERS.map((tier, index) => {
          const isUnlocked = streakDays >= tier.days;
          const isCurrent = currentTier?.days === tier.days;
          const isLast = index === REWARD_TIERS.length - 1;
          const nextTier = REWARD_TIERS[index + 1];
          const isNextUp =
            nextTier && streakDays < nextTier.days && streakDays >= tier.days;

          return (
            <div key={tier.days} className="relative">
              {/* Roadmap Line */}
              {!isLast && (
                <div
                  className={`absolute left-10 top-16 h-12 w-0.5 -translate-x-0.5 ${
                    isUnlocked ? "bg-mintGreen" : "bg-plumPurple/30"
                  }`}
                />
              )}

              {/* Reward Card */}
              <div
                className={`relative flex items-center gap-4 rounded-xl border-2 p-4 ${
                  isCurrent
                    ? "border-mintGreen bg-mintGreen/20 shadow-sm"
                    : isUnlocked
                      ? "border-lemonYellow bg-lemonYellow/15 shadow-sm"
                      : "border-plumPurple/30 bg-white/80"
                }`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {isUnlocked ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mintGreen shadow-sm">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-plumPurple/40 bg-white shadow-sm">
                      <span className="font-heading text-base font-bold text-plumPurple/70">
                        {tier.days}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4
                      className={`mb-1 font-heading text-base font-bold ${
                        isCurrent
                          ? "text-plumPurple"
                          : isUnlocked
                            ? "text-plumPurple"
                            : "text-plumPurple/80"
                      }`}
                    >
                      {tier.label} Tier
                    </h4>
                    <p className="font-display text-sm font-medium text-plumPurple/70">
                      {tier.days} day{tier.days !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div
                      className={`font-heading text-2xl font-bold ${
                        isCurrent
                          ? "text-plumPurple"
                          : isUnlocked
                            ? "text-plumPurple"
                            : "text-plumPurple/60"
                      }`}
                    >
                      {tier.freeMessages}
                    </div>
                    <div className="font-display text-xs font-medium text-plumPurple/70">
                      messages
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress indicator for next tier */}
              {isNextUp && nextTier && (
                <div className="ml-20 mt-2">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-display font-medium text-plumPurple/70">
                      {nextTier.days - streakDays} more day
                      {nextTier.days - streakDays !== 1 ? "s" : ""}
                    </span>
                    <span className="font-display font-medium text-plumPurple/70">
                      {streakDays} / {nextTier.days}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-plumPurple/25">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-bubblegumPink to-lemonYellow shadow-sm transition-all duration-500"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Max tier reached */}
      {!getNextRewardTier(streakDays) && currentTier && (
        <div className="mt-4 rounded-xl border-2 border-lemonYellow bg-lemonYellow/20 p-4 text-center">
          <p className="font-heading font-bold text-plumPurple">
            🎉 Max Tier Achieved!
          </p>
          <p className="font-display text-sm text-plumPurple/80">
            You&apos;ve unlocked all rewards. Keep your streak going!
          </p>
        </div>
      )}
    </div>
  );
}
