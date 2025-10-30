"use client";

import { createContext, ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { client } from "@/lib/client";

export const Context = createContext<{
  streamPromise?: Promise<ReadableStream>;
  setStreamPromise: (v: Promise<ReadableStream> | undefined) => void;
}>({
  setStreamPromise: () => {},
});

// 0G-Galileo-Testnet config (kept for reference if needed elsewhere)
// const ogGalileo = {
//   id: 16601,
//   name: "0G-Galileo-Testnet",
//   nativeCurrency: {
//     name: "0G Token",
//     symbol: "OG",
//     decimals: 18,
//   },
//   rpcUrls: {
//     default: { http: ["https://evmrpc-testnet.0g.ai"] },
//     public: { http: ["https://evmrpc-testnet.0g.ai"] },
//   },
//   blockExplorers: {
//     default: {
//       name: "0G Chain Explorer",
//       url: "https://chainscan-galileo.0g.ai",
//     },
//   },
//   testnet: true,
// } as const;

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  const [streamPromise, setStreamPromise] = useState<Promise<ReadableStream>>();

  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider client={client}>
        <Context value={{ streamPromise, setStreamPromise }}>
          {children}
        </Context>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
