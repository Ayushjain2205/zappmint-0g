"use client";

import UnifiedNavbar from "./unified-navbar";

interface AppNavbarProps {
  title: string;
  creator?: string;
}

export default function AppNavbar({ title, creator }: AppNavbarProps) {
  return <UnifiedNavbar showAppInfo={{ title, creator }} />;
}

