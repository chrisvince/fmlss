import Head from 'next/head'
import { ReactElement, ReactNode, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { withAuthUser } from 'next-firebase-auth'
import { CacheProvider, EmotionCache } from '@emotion/react'
import Script from 'next/script'
import { NextPage } from 'next'
import { store } from '../store'
import { Provider as ReduxProvider } from 'react-redux'

import initAuth from '../utils/initAuth'
import initFirebase from '../utils/initFirebase'
import Layout from '../components/Layout'
import { light } from '../styles/theme'
import createEmotionCache from '../utils/createEmotionServer'
import isDevelopment from '../utils/isDevelopment'

initFirebase()
initAuth()

const clientSideEmotionCache = createEmotionCache()
const GOOGLE_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type Props = AppProps & {
  Component: NextPageWithLayout
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

  const getLayout = Component.getLayout ?? (page => (
    <Layout>{page}</Layout>
  ))

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {!isDevelopment && GOOGLE_TAG_MANAGER_ID && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');
        `}
        </Script>
      )}
      <ReduxProvider store={store}>
        <ThemeProvider theme={light}>
          <CssBaseline />
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </ReduxProvider>
    </CacheProvider>
  )
}

export default withAuthUser()(App as any)
