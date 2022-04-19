import {
  PublicKey,
} from "@solana/web3.js"
import * as borsh from "borsh"

/**
 * The state of a greeting account managed by the hello world program
 */
export class GreetingAccount {
  counter = 0;
  constructor(fields: { counter: number, } | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
    }
  }
}

/**
 * Borsh schema definition for greeting accounts
 */
export const GreetingSchema = new Map([
  [GreetingAccount, { kind: "struct", fields: [["counter", "u32"]] }],
]);

/**
 * The expected size of each greeting account.
 */
export const GREETING_SIZE = borsh.serialize(
  GreetingSchema,
  new GreetingAccount(),
).length;

export const GREETING_PROGRAM_ID = new PublicKey("3QTn9KLjHUJ8yC1sc9KLDBQAjT2pJX6DZrAEEXTtHFQZ")