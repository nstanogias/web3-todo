"use client";

import { Button } from "./ui/button";
import { erc721Abi, erc721Address } from "@/contracts/erc721";
import { useToast } from "@/hooks/use-toast";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import {
  useConfig,
  useWriteContract,
  useReadContract,
  useAccount,
} from "wagmi";

type Props = {
  completedTodosCounter: number;
};

const MintButton = ({ completedTodosCounter }: Props) => {
  const { address: walletAddress } = useAccount();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const result = useReadContract({
    abi: erc721Abi,
    address: erc721Address,
    functionName: "balanceOf",
    args: [walletAddress ?? `0x${""}`],
  });
  const mintedNFTs = Number(result.data);
  const config = useConfig();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: hash, writeContract } = useWriteContract();

  const handleTransactionSubmitted = async (txHash: string) => {
    const transactionReceipt = await waitForTransactionReceipt(config, {
      confirmations: 2,
      hash: txHash as `0x${string}`,
    });
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
            onSuccess: () => {
              setIsPending(false);
              alert("NFT minted and burned successfully! " + txHash);
            },
            onError: (error) => {
              setIsPending(false);
              toast({
                variant: "destructive",
                description: error.message,
              });
            },
          }
        );
      }
    }
  };

  const mint = () => {
    setIsPending(true);
    writeContract(
      {
        address: erc721Address,
        abi: erc721Abi,
        functionName: "mint",
      },
      {
        onSuccess: handleTransactionSubmitted,
        onError: (error) => {
          setIsPending(false);
          toast({
            variant: "destructive",
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <>
      <Button
        onClick={mint}
        disabled={
          isPending || Math.floor(completedTodosCounter / 2) < mintedNFTs
        }
        className="my-16"
      >
        {isPending ? "Confirming..." : "Mint"}
      </Button>
      {/* {hash && <div>Transaction Hash: {hash}</div>} */}
    </>
  );
};

export default MintButton;
