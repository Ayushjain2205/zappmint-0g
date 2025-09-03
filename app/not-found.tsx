import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import LightningBoltIcon from "@/components/icons/lightning-bolt";
import LogoSmall from "@/components/icons/logo-small";
import ArrowRightIcon from "@/components/icons/arrow-right";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-softPeach font-body text-plumPurple">
      <Header />
      <div className="flex grow items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-plumPurple/20 bg-white/80 px-10 py-12 shadow-xl">
          <span className="mb-2 animate-float">
            {/* Playful accent icon */}
            <LogoSmall />
          </span>
          <h2 className="mb-2 text-center font-heading text-4xl font-bold tracking-tight">
            404 | Not Found
          </h2>
          <p className="mb-4 max-w-xs text-center text-lg text-plumPurple/80">
            Oops! The page you’re looking for doesn’t exist or has been moved.
          </p>
          <Link href="/">
            <Button
              size="lg"
              className="gap-2 rounded-xl bg-bubblegumPink px-6 py-3 font-heading font-bold text-plumPurple shadow-md transition-all hover:bg-lemonYellow"
            >
              Go Home
              <ArrowRightIcon width={18} height={18} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
