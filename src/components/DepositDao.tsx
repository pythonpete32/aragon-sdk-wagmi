"use client";

import {
  DepositParams,
  TokenType,
  GasFeeEstimation,
  DaoDepositSteps,
} from "@aragon/sdk-client";
import { useAragon } from "../contexts/AragonContext";

export function DepositDao() {
  const { baseClient } = useAragon();

  const handleDeposit = async () => {
    if (!baseClient) {
      console.error("Client not initialized");
      return;
    }

    const depositParams: DepositParams = {
      daoAddressOrEns: "box.dao.eth",
      amount: BigInt(1), // amount in wei
      type: TokenType.NATIVE, // 'native' for ETH, otherwise 'erc20' for ERC20 tokens
    };

    // Estimate how much gas the transaction will cost.
    try {
      const estimatedGas: GasFeeEstimation =
        await baseClient.estimation.deposit(depositParams);
      console.log({ avg: estimatedGas.average, max: estimatedGas.max });

      // Deposit ETH to the DAO.
      const steps = baseClient.methods.deposit(depositParams);
      for await (const step of steps) {
        switch (step.key) {
          case DaoDepositSteps.DEPOSITING:
            console.log({ txHash: step.txHash });
            break;
          case DaoDepositSteps.DONE:
            console.log({ amount: step.amount });
            break;
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <p>box.dao.eth</p>
      <button onClick={handleDeposit}>Deposit 1 GWEI</button>
    </div>
  );
}
