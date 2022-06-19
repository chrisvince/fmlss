import type { AppProps } from 'next/app'

import initAuth from '../utils/initAuth'
import initFirebase from '../utils/initFirebase'
import Layout from '../components/Layout'

initFirebase()
initAuth()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
