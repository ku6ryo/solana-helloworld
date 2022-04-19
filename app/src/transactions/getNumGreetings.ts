import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
} from "@solana/web3.js"
import * as borsh from "borsh"
import { createProgramAccount } from "./createProgramAccount";
import { GreetingAccount, GreetingSchema, GREETING_PROGRAM_ID } from "./GreetingAccount";

export async function getNumGreetings(wallet: WalletContextState, connection: Connection) {
  if (!wallet.publicKey) {
    throw new Error("Wallet does not have pubkey.")
  }
  const pdaPublicKey = await createProgramAccount(wallet, connection, GREETING_PROGRAM_ID)
  const accountInfo = await connection.getAccountInfo(pdaPublicKey);
  if (accountInfo === null) {
    throw "Error: cannot find the greeted account";
  }
  const greeting = borsh.deserialize(
    GreetingSchema,
    GreetingAccount,
    accountInfo.data,
  );
  return greeting.counter
}