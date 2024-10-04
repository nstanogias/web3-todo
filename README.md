This is a blockchain-integrated to-do list web application using Next.js, TypeScript, and web3 technologies.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Functional Requirements

To learn more about Next.js, take a look at the following resources:

- User Authentication via Web3

  - User logs in via connecting their MetaMask wallet
  - User is required to sign a message with their wallet to properly sign in

- To-Do List Functionality. Authenticated users can:

  - Create to-do items via the provided API
  - Read to-do items via the provided API
  - Update to-do items via the provided API
  - Delete to-do items via the provided API

- Web3 functionalities. Authenticated users must:
  - View current ERC20 token balance
  - Mint an NFT after 2 to do list items are marked completed
    - The mint button is initially disabled until completed the tasks.
    - The mint transaction must await a specified number of blocks
  - Burn the NFT
    - The burn of the NFT will send an amount of an ERC20 token. After successfull burn, the ERC20 balance is updated in the UI.

## Technologies used
