import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Connection,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js"
import { createProgramAccount } from "./createProgramAccount";
import { GREETING_PROGRAM_ID } from "./GreetingAccount";

export async function hello(wallet: WalletContextState, connection: Connection) {
  if (!wallet.publicKey) {
    throw new Error("Wallet does not have pubkey.")
  }
  // Checks if the program is deployed.
  const program = await connection.getAccountInfo(GREETING_PROGRAM_ID);
  if (!program || !program.executable) {
    throw new Error("The program is not found or not executable.")
  }
  const pdaPublicKey = await createProgramAccount(wallet, connection, GREETING_PROGRAM_ID)
  const signature = await wallet.sendTransaction(new Transaction().add(
    new TransactionInstruction({
      keys: [{ pubkey: pdaPublicKey, isSigner: false, isWritable: true }],
      programId: GREETING_PROGRAM_ID,
      data: Buffer.alloc(0), // All instructions are hellos
    })
  ), connection)
  await connection.confirmTransaction(signature)
}