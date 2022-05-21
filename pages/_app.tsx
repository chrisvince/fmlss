import type { AppProps } from 'next/app'
import initAuth from '../utils/initAuth'
import initFirebase from '../utils/initFirebase'

initFirebase()
initAuth()

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
