import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaUser } from "react-icons/fa";
import { PiCoinVerticalFill } from "react-icons/pi";

// Icon SVGs
const Wallet = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect
      x="2"
      y="7"
      width="20"
      height="14"
      rx="3"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="2"
      y="7"
      width="20"
      height="14"
      rx="3"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="2"
      y="3"
      width="20"
      height="4"
      rx="2"
      fill="#fff"
      fillOpacity=".2"
    />
    <rect
      x="2"
      y="3"
      width="20"
      height="4"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <circle cx="18" cy="14" r="2" fill="#fff" fillOpacity=".3" />
  </svg>
);
const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="3"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="3"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <circle cx="8" cy="10" r="2" fill="#fff" fillOpacity=".3" />
    <path d="M21 19l-5.5-7-4.5 6-3-4-3 5" stroke="#fff" strokeWidth="1.5" />
  </svg>
);
const BarChart3 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect
      x="3"
      y="10"
      width="4"
      height="8"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="3"
      y="10"
      width="4"
      height="8"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="9"
      y="6"
      width="4"
      height="12"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="9"
      y="6"
      width="4"
      height="12"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="15"
      y="3"
      width="4"
      height="15"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="15"
      y="3"
      width="4"
      height="15"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
  </svg>
);
const Zap = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <polygon
      points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      fill="#fff"
      fillOpacity=".1"
    />
    <polygon
      points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      stroke="#fff"
      strokeWidth="1.5"
    />
  </svg>
);
const Users = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="8" cy="8" r="4" fill="#fff" fillOpacity=".1" />
    <circle cx="8" cy="8" r="4" stroke="#fff" strokeWidth="1.5" />
    <circle cx="17" cy="13" r="3" fill="#fff" fillOpacity=".1" />
    <circle cx="17" cy="13" r="3" stroke="#fff" strokeWidth="1.5" />
    <path
      d="M2 21c0-3.314 3.134-6 7-6s7 2.686 7 6"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <path d="M14 21c0-2.21 2.239-4 5-4" stroke="#fff" strokeWidth="1.5" />
  </svg>
);
const Boxes = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
  </svg>
);
const Layout = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="3"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="3"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="7"
      y="7"
      width="10"
      height="4"
      rx="1"
      fill="#fff"
      fillOpacity=".2"
    />
    <rect
      x="7"
      y="7"
      width="10"
      height="4"
      rx="1"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="7"
      y="13"
      width="4"
      height="4"
      rx="1"
      fill="#fff"
      fillOpacity=".2"
    />
    <rect
      x="7"
      y="13"
      width="4"
      height="4"
      rx="1"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <rect
      x="13"
      y="13"
      width="4"
      height="4"
      rx="1"
      fill="#fff"
      fillOpacity=".2"
    />
    <rect
      x="13"
      y="13"
      width="4"
      height="4"
      rx="1"
      stroke="#fff"
      strokeWidth="1.5"
    />
  </svg>
);
const Globe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity=".1" />
    <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="7" ry="10" stroke="#fff" strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#fff" strokeWidth="1.5" />
  </svg>
);
const Fun = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity=".1" />
    <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.5" />
    <circle cx="8" cy="9" r="1.5" fill="#fff" fillOpacity=".3" />
    <circle cx="16" cy="9" r="1.5" fill="#fff" fillOpacity=".3" />
    <path
      d="M8 14c1.5 2 4.5 2 6 0"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const Tool = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      fill="#fff"
      fillOpacity=".1"
    />
    <path
      d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Game = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect
      x="2"
      y="6"
      width="20"
      height="12"
      rx="2"
      fill="#fff"
      fillOpacity=".1"
    />
    <rect
      x="2"
      y="6"
      width="20"
      height="12"
      rx="2"
      stroke="#fff"
      strokeWidth="1.5"
    />
    <circle cx="8" cy="12" r="1" fill="#fff" fillOpacity=".3" />
    <circle cx="16" cy="12" r="1" fill="#fff" fillOpacity=".3" />
    <path
      d="M12 10v4M10 12h4"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export type ZappProject = {
  id: number | string;
  title: string;
  creator: string;
  category: string;
  emoji?: string;
  icon?: React.ReactNode; // Keep for backward compatibility
  gradient: string;
  description?: string;
  tokenPrice?: string;
  createdAt?: string;
};

interface ZappCardProps {
  project: ZappProject;
}

const truncateAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Category to emoji mapping
const getCategoryEmoji = (category: string): string => {
  const emojiMap: Record<string, string> = {
    Fun: "🎉",
    Social: "👥",
    NFT: "🖼️",
    Tool: "🔧",
    Game: "🎮",
  };
  return emojiMap[category] || "📱";
};

export function ZappCard({ project }: ZappCardProps) {
  const router = useRouter();
  // Placeholder values for description and price
  const description = project.description || "No description available.";
  const tokenPrice = project.tokenPrice || "0.002";
  const emoji = project.emoji || getCategoryEmoji(project.category);

  return (
    <div
      className="group cursor-pointer"
      onClick={() => router.push(`/apps/${project.id}`)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          router.push(`/apps/${project.id}`);
      }}
    >
      <div
        className={
          "relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-xl border border-bubblegumPink bg-white p-3 text-plumPurple shadow-sm transition-all duration-300 hover:scale-[1.025] hover:shadow-md sm:min-h-[200px] sm:p-4"
        }
      >
        {/* Category with Emoji */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-base sm:text-lg">{emoji}</span>
          <span className="font-display text-xs font-semibold text-bubblegumPink sm:text-sm">
            {project.category}
          </span>
        </div>
        {/* Project Name */}
        <h3 className="mb-1 truncate font-heading text-lg font-bold sm:text-xl">
          {project.title}
        </h3>
        {/* Description */}
        <p className="mb-2 line-clamp-2 font-body text-xs text-plumPurple/80 sm:text-sm">
          {description}
        </p>
        {/* Pills Row */}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2 sm:gap-2">
          {/* Token Price Pill */}
          <span className="flex items-center gap-1 rounded-full bg-mintGreen/20 px-2 py-1 text-[10px] font-bold text-mintGreen sm:px-3 sm:text-xs">
            <PiCoinVerticalFill className="text-sm text-mintGreen sm:text-base" />{" "}
            Ξ {tokenPrice}
          </span>
          {/* Creator Pill */}
          <span className="flex items-center gap-1 rounded-full bg-bubblegumPink/20 px-2 py-1 text-[10px] font-bold text-plumPurple sm:px-3 sm:text-xs">
            <FaUser className="text-xs text-bubblegumPink sm:text-sm" />{" "}
            {truncateAddress(project.creator)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Export icons for use in featuredProjects
export const ZappIcons = {
  Wallet,
  ImageIcon,
  BarChart3,
  Zap,
  Users,
  Boxes,
  Layout,
  Globe,
  Fun,
  Tool,
  Game,
};
