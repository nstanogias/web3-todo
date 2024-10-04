"use client";

import { Button } from "./ui/button";
import { erc721Abi, erc721Address } from "@/contracts/erc721";
import { waitForTransactionReceipt } from "@wagmi/core";
import {
  useConfig,
  useWriteContract,
  useReadContract,
  useAccount,
} from "wagmi";

const MintButton = () => {
  const { address: walletAddress } = useAccount();
  const result = useReadContract({
    abi: erc721Abi,
    address: erc721Address,
    functionName: "balanceOf",
    args: [walletAddress ?? `0x${""}`],
  });
  const mintedNFTs = Number(result.data);
  const config = useConfig();
  const { data: hash, isPending, writeContract } = useWriteContract();

  const handleTransactionSubmitted = async (txHash: string) => {
    const transactionReceipt = await waitForTransactionReceipt(config, {
      confirmations: 2,
      hash: txHash as `0x${string}`,
    });
    console.log("transactionReceipt", transactionReceipt);

    if (transactionReceipt.status === "success") {
      if (transactionReceipt.logs[0].topics[3]) {
        // ERC721 Transfer event specification
        const tokenId = parseInt(transactionReceipt.logs[0].topics[3], 16);
        writeContract(
          {
            address: erc721Address,
            abi: erc721Abi,
            functionName: "burn",
            args: [BigInt(tokenId)],
          },
          {
            // onSuccess: handleTransactionSubmitted,
            onError: (error) => {
              console.log(error);
            },
          }
        );
      }
    }
  };

  const mint = () => {
    writeContract(
      {
        address: erc721Address,
        abi: erc721Abi,
        functionName: "mint",
      },
      {
        onSuccess: handleTransactionSubmitted,
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  return (
    <>
      <Button onClick={mint} disabled={isPending} className="my-16">
        {isPending ? "Confirming..." : "Mint"}
      </Button>
      {/* {hash && <div>Transaction Hash: {hash}</div>} */}
    </>
  );
};

export default MintButton;
