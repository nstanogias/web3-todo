"use client";

import MintButton from "./MintButton";
import TodoTable from "./TodoTable";
import TokenInfo from "./TokenInfo";
import { erc721Abi, erc721Address } from "@/contracts/erc721";
import { useToast } from "@/hooks/use-toast";
import {
  getBurntNFTsCount,
  incrementBurntNFTs,
} from "@/lib/actions/todo.actions";
import { Todo } from "@/types";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useConfig, useWriteContract } from "wagmi";

type Props = {
  todos: Todo[];
  totalPages: number;
  page: number;
};

const Home = ({ todos, totalPages, page }: Props) => {
  const { status } = useSession();
  const router = useRouter();
  const [nftsCount, setNftsCount] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const { address: walletAddress } = useAccount();

  const config = useConfig();
  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      router.refresh();
    }
  }, [status]);

  const fetchNftsCount = useCallback(async () => {
    const count = await getBurntNFTsCount(walletAddress ?? `0x${""}`);
    setNftsCount(count ?? 0);
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      fetchNftsCount();
    }
  }, [walletAddress, fetchNftsCount]);

  if (status !== "authenticated") {
    return null;
  }
  // console.log(todos);
  const completedTodosCounter = todos.filter((todo) => todo.completed).length;

  const handleSuccessBurn = async () => {
    await incrementBurntNFTs(walletAddress ?? `0x${""}`);
    await fetchNftsCount();
    setIsPending(false);
    alert("NFT minted and burned successfully! ");
  };

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
            onSuccess: handleSuccessBurn,
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

  const onMint = () => {
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
    <div className="w-full wrapper">
      <TokenInfo />
      <MintButton
        completedTodosCounter={completedTodosCounter}
        nftsCount={nftsCount}
        isPending={isPending}
        mint={onMint}
      />
      <TodoTable todos={todos} totalPages={totalPages} page={page} />
    </div>
  );
};

export default Home;
