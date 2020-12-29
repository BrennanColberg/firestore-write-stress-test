import { AppProps } from "next/dist/next-server/lib/router/router"
import { useEffect } from "react"
import firestoreClient from "../firebase/firestoreClient"
import "../styles/index.css"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  useEffect(() => {
    ;(window as any).firestoreClient = firestoreClient // eslint-disable-line @typescript-eslint/no-explicit-any
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
