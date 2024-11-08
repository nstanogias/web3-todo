"use client";

import { Button } from "./ui/button";

type Props = {
  completedTodosCounter: number;
  nftsCount: number;
  isPending: boolean;
  mint: () => void;
};

const MintButton = ({
  completedTodosCounter,
  nftsCount,
  isPending,
  mint,
}: Props) => {
  console.log(nftsCount);
  return (
    <>
      <Button
        onClick={mint}
        disabled={
          isPending ||
          completedTodosCounter < 2 ||
          Math.floor(completedTodosCounter / 2) < nftsCount
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
