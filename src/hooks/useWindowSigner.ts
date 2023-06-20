import { useState, useEffect } from "react";
import { ethers, Signer } from "ethers";

type EthereumWindow = typeof window & {
  ethereum?: {
    isMetaMask: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<void>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener: (
      eventName: string,
      callback: (...args: any[]) => void
    ) => void;
  };
};

function useWindowSigner() {
  const [signer, setSigner] = useState<Signer | null>(null);
  const [chain, setChain] = useState<number | null>(null);

  useEffect(() => {
    async function getSigner() {
      const ethereumWindow = window as EthereumWindow;
      if (ethereumWindow.ethereum) {
        const provider = new ethers.providers.Web3Provider(
          ethereumWindow.ethereum
        );
        const { chainId } = await provider.getNetwork();
        setChain(chainId);
        await ethereumWindow.ethereum.request({
          method: "eth_requestAccounts",
        });
        const signer = provider.getSigner();
        setSigner(signer);
      } else {
        console.log("Metamask not detected");
      }
    }

    const handleChainChanged = (chainId: string) => {
      // Parse the chainId as a hexadecimal number (base 16)
      setChain(parseInt(chainId, 16));
    };

    const handleAccountsChanged = () => {
      getSigner();
    };

    getSigner();

    const ethereumWindow = window as EthereumWindow;
    if (ethereumWindow.ethereum) {
      ethereumWindow.ethereum.on("chainChanged", handleChainChanged);
      ethereumWindow.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (ethereumWindow.ethereum) {
        ethereumWindow.ethereum.removeListener(
          "chainChanged",
          handleChainChanged
        );
        ethereumWindow.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  return { signer, chain };
}

export default useWindowSigner;
