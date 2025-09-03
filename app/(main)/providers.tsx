"use client";

import { createContext, ReactNode, useState } from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Context = createContext<{
  streamPromise?: Promise<ReadableStream>;
  setStreamPromise: (v: Promise<ReadableStream> | undefined) => void;
}>({
  setStreamPromise: () => {},
});

// 0G-Galileo-Testnet config
const ogGalileo = {
  id: 16601,
  name: "0G-Galileo-Testnet",
  nativeCurrency: {
    name: "0G Token",
    symbol: "OG",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://evmrpc-testnet.0g.ai"] },
    public: { http: ["https://evmrpc-testnet.0g.ai"] },
  },
  blockExplorers: {
    default: {
      name: "0G Chain Explorer",
      url: "https://chainscan-galileo.0g.ai",
    },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "ZappForge",
  projectId: "zappforge-0g-galileo", // Updated project ID for 0G network
  chains: [ogGalileo], // Only 0G network
  transports: {
    [ogGalileo.id]: http("https://evmrpc-testnet.0g.ai"),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  const [streamPromise, setStreamPromise] = useState<Promise<ReadableStream>>();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme()}
          showRecentTransactions={false}
          initialChain={ogGalileo}
        >
          <Context value={{ streamPromise, setStreamPromise }}>
            {children}
          </Context>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
