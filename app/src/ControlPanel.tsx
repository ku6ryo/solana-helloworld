import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useEffect, useState } from "react";
import { airdrop } from "./transactions/airdrop";
import { getNumGreetings } from "./transactions/getNumGreetings";
import { hello } from "./transactions/hello";

export function ControlPanel() {
    const wallet = useWallet()
    const { connection } = useConnection()
    const [balance, setBalance] = useState(0)
    const [hellos, setHellos] = useState(0)
    const [processing, setProcessing] = useState(false)

    const refreshBalance = async () => {
        if (wallet.publicKey) {
            const balance = await connection.getBalance(wallet.publicKey)
            setBalance(balance / LAMPORTS_PER_SOL)
        }
    }

    const updateHellos = async () => {
        if (wallet.publicKey) {
            setHellos(await getNumGreetings(wallet, connection))
        }
    }

    useEffect(() => {
        ;(async () => {
           await refreshBalance()
           await updateHellos()
        })()
    }, [wallet.publicKey])

    const onClickHello = async () => {
        setProcessing(true)
        await hello(wallet, connection)
        await refreshBalance()
        await updateHellos()
        setProcessing(false)
    }

    const onClickAirdrop = async () => {
        setProcessing(true)
        await airdrop(connection, wallet)
        await refreshBalance()
        setProcessing(false)
    }

    return (
        <div>
            <div>{balance} SOL</div>
            <div>You greeted {hellos} times.</div>
            <div>
                <button onClick={onClickHello} disabled={processing}>HELLO</button>
            </div>
            <div>
                <button onClick={onClickAirdrop} disabled={processing}>Request Airdrop</button>
            </div>
        </div>
    )
}