import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaUser, FaCalendarAlt } from "react-icons/fa";
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

export type ZappProject = {
  id: number | string;
  title: string;
  creator: string;
  category: string;
  icon: React.ReactNode;
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

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

export function ZappCard({ project }: ZappCardProps) {
  const router = useRouter();
  // Placeholder values for description and price
  const description = project.description || "No description available.";
  const tokenPrice = project.tokenPrice || "0.002";
  const createdAt = (project as any).createdAt || "";
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
          "relative flex h-[200px] flex-col justify-between overflow-hidden rounded-xl border border-bubblegumPink bg-white p-4 text-plumPurple shadow-sm transition-all duration-300 hover:scale-[1.025] hover:shadow-md"
        }
      >
        {/* Category with Icon */}
        <div className="mb-2 flex items-center gap-2">
          <div className="rounded-full bg-bubblegumPink/10 p-1">
            {project.icon}
          </div>
          <span className="font-display text-xs font-semibold text-bubblegumPink">
            {project.category}
          </span>
        </div>
        {/* Project Name */}
        <h3 className="mb-1 truncate font-heading text-xl font-bold">
          {project.title}
        </h3>
        {/* Description */}
        <p className="mb-2 line-clamp-2 font-body text-sm text-plumPurple/80">
          {description}
        </p>
        {/* Pills Row */}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {/* Token Price Pill */}
          <span className="flex items-center gap-1 rounded-full bg-mintGreen/20 px-3 py-1 text-xs font-bold text-mintGreen">
            <PiCoinVerticalFill className="text-base text-mintGreen" /> Ξ{" "}
            {tokenPrice}
          </span>
          {/* Creator Pill */}
          <span className="flex items-center gap-1 rounded-full bg-bubblegumPink/20 px-3 py-1 text-xs font-bold text-plumPurple">
            <FaUser className="text-sm text-bubblegumPink" />{" "}
            {truncateAddress(project.creator)}
          </span>
          {/* Date Pill */}
          {createdAt && (
            <span className="flex items-center gap-1 rounded-full bg-lemonYellow/30 px-3 py-1 text-xs font-bold text-plumPurple">
              <FaCalendarAlt className="text-sm text-lemonYellow" />{" "}
              {formatDate(createdAt)}
            </span>
          )}
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
};
