import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Connection,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"

export async function airdrop(connection: Connection, wallet: WalletContextState) {
  if (!wallet.publicKey) {
    throw new Error("Wallet does not have pubkey.")
  }
  await connection.requestAirdrop(wallet.publicKey, 1 * LAMPORTS_PER_SOL)
}