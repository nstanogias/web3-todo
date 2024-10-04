"use client";

import { erc20Abi, erc20Address } from "@/contracts/erc20";
import { formatBalance } from "@/lib/utils";
import { useAccount, useReadContract } from "wagmi";

const TokenInfo = () => {
  const { address: walletAddress } = useAccount();

  const result = useReadContract({
    abi: erc20Abi,
    address: erc20Address,
    functionName: "balanceOf",
    args: [walletAddress ?? `0x${""}`],
  });
  return (
    <h1 className="text-2xl font-bold mb-6 text-primary-500">
      ERC20 balance: {formatBalance(result.data)}
    </h1>
  );
};

export default TokenInfo;
