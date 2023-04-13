import { useConnection } from "@/lib";
import { useEffect } from "react";
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import App from "./app"


export default function Home() {
    useEffect(() => {
        window.solana.on("connect", () => {
            console.log('updated...')
        })
        useConnection()
        return () => {
            window.solana.disconnect();
        }
    }, [])

    return (
        <GeistProvider themeType="dark">
            <CssBaseline />
            <App />
        </GeistProvider>
    )
}
