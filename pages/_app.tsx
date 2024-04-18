import Head from 'next/head'
import { ReactElement, ReactNode, useMemo } from 'react'
import type { AppContext, AppProps } from 'next/app'
import { CssBaseline } from '@mui/material'
import Script from 'next/script'
import { NextPage } from 'next'
import { store } from '../store'
import { Provider as ReduxProvider } from 'react-redux'
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter'
import qs from 'querystring'

import initFirebaseClient from '../utils/initFirebaseClient'
import Layout from '../components/Layout'
import resolveTheme from '../styles/theme'
import isDevelopment from '../utils/isDevelopment'
import { ThemeProvider } from '@mui/material/styles'
import useColorScheme from '../utils/useColorScheme'
import { ColorSchemeSetting } from '../types'

initFirebaseClient()

const GOOGLE_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID

type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type Props = AppProps & {
  Component: NextPageWithLayout
  colorSchemeCookie?: ColorSchemeSetting
}

const App = (props: Props) => {
  const { Component, pageProps, colorSchemeCookie } = props

  const { value: colorScheme } = useColorScheme({
    ssrValue: colorSchemeCookie,
  })

  const theme = useMemo(() => resolveTheme(colorScheme), [colorScheme])
  const getLayout = Component.getLayout ?? (page => <Layout>{page}</Layout>)

  return (
    <AppCacheProvider {...props}>
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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </ReduxProvider>
    </AppCacheProvider>
  )
}

App.getInitialProps = async ({ ctx }: AppContext) => {
  if (!ctx.req?.headers.cookie) {
    return {}
  }

  const cookies = qs.decode(ctx.req.headers.cookie, '; ')

  return {
    colorSchemeCookie: cookies.colorScheme,
  }
}

export default App
