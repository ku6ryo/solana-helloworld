import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js"
import { GREETING_SIZE } from "./GreetingAccount";

export const PROGRAM_ACCOUNT_SEED = "helloworld"

export async function createProgramAccount(wallet: WalletContextState, connection: Connection, programId: PublicKey) {
  const { publicKey } = wallet
  if (!publicKey) {
    throw new Error("Wallet does not have public key.")
  }
  const pdaPublicKey = await PublicKey.createWithSeed(publicKey, PROGRAM_ACCOUNT_SEED, programId)
  const pda = await connection.getAccountInfo(pdaPublicKey);
  if (pda === null) {
    const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE)
    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: publicKey,
        basePubkey: publicKey,
        seed: PROGRAM_ACCOUNT_SEED,
        newAccountPubkey: pdaPublicKey,
        lamports,
        space: GREETING_SIZE,
        programId,
      }),
    );
    const signature = await wallet.sendTransaction(transaction, connection)
    await connection.confirmTransaction(signature, "confirmed");
  }
  return pdaPublicKey
}