"use client";

import * as React from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";

import { chains, config } from "../wagmi";
import { AragonProvider } from "../contexts/AragonContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <AragonProvider>{mounted && children}</AragonProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
