import Head from 'next/head'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { withAuthUser } from 'next-firebase-auth'
import { CacheProvider, EmotionCache } from '@emotion/react'

import initAuth from '../utils/initAuth'
import initFirebase from '../utils/initFirebase'
import Layout from '../components/Layout'
import { light } from '../styles/theme'
import createEmotionCache from '../utils/createEmotionServer'

initFirebase()
initAuth()

const clientSideEmotionCache = createEmotionCache()

interface Props extends AppProps {
  emotionCache?: EmotionCache
}

const App = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: Props) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={light}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default withAuthUser()(App as any)
