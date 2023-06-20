"use client";

import {
  Client,
  Context,
  ContextParams,
  TokenVotingClient,
} from "@aragon/sdk-client";
import { createContext, useContext, useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { Signer } from "ethers";
import useWindowSigner from "../hooks/useWindowSigner";
import { polygonParams, mumbaiParams } from "../constants";

export interface AragonSDKContextValue {
  context?: Context;
  baseClient?: Client;
  tokenVotingClient?: TokenVotingClient;
}

const AragonSDKContext = createContext<AragonSDKContextValue>({});

export function AragonProvider({ children }: { children: React.ReactNode }) {
  const { signer: walletClient } = useWindowSigner();
  const { chain } = useNetwork();
  const [context, setContext] = useState<Context | undefined>(undefined);
  const [baseClient, setBaseClient] = useState<Client | undefined>(undefined);
  const [tokenVotingClient, setTokenVotingClient] = useState<
    TokenVotingClient | undefined
  >(undefined);

  useEffect(() => {
    if (!walletClient || !chain) return;

    const contextParams: ContextParams = {
      network: chain.id,
      signer: walletClient as unknown as Signer, // probably not going to work
      ...(chain.id === 137 ? polygonParams : mumbaiParams),
    };
    const context: Context = new Context(contextParams);
    const client: Client = new Client(context);
    const tokenVotingClient = new TokenVotingClient(context);

    setBaseClient(client);
    setTokenVotingClient(tokenVotingClient);
    setContext(context);
  }, [walletClient, chain]);

  return (
    <AragonSDKContext.Provider
      value={{
        context,
        baseClient,
        tokenVotingClient,
      }}
    >
      {children}
    </AragonSDKContext.Provider>
  );
}

export function useAragon(): AragonSDKContextValue {
  const context = useContext(AragonSDKContext);
  if (!context)
    throw new Error("useAragon hooks must be used within an AragonSDKWrapper");
  return context;
}
