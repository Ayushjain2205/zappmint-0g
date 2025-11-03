import AppNavbar from "@/components/app-navbar";
import TokenMarquee from "@/components/TokenMarquee";

function Spinner() {
  return (
    <svg
      className="h-8 w-8 animate-spin text-yellow-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
  );
}

export default function Loading() {
  return (
    <div className="flex h-screen flex-col bg-softPeach font-body text-plumPurple">
      {/* Unified Navbar with App Info */}
      <AppNavbar title="Loading..." creator="0xdsc..poc" />
      {/* Token Marquee */}
      <TokenMarquee appName="Loading..." creator="0xdsc..poc" />
      {/* App Output - padding-top accounts for fixed navbar (~44px) and marquee (~40px) */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-hidden pt-[88px]">
        <div className="flex flex-col items-center justify-center">
          <Spinner />
          <div className="mt-4 font-display text-bubblegumPink">
            Loading app...
          </div>
        </div>
      </div>
    </div>
  );
}
