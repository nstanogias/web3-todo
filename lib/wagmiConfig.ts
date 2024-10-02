import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonAmoy } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "web3-todo",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  chains: [polygonAmoy],
  ssr: true,
});
