import { ReactElement, ReactNode, useEffect } from 'react'
import type { AppContext, AppProps } from 'next/app'
import { CssBaseline } from '@mui/material'
import { NextPage } from 'next'
import { store } from '../store'
import { Provider as ReduxProvider } from 'react-redux'
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter'
import qs from 'querystring'
import { Assistant } from 'next/font/google'
import { GoogleTagManager, sendGTMEvent } from '@next/third-parties/google'

import initFirebaseClient from '../utils/initFirebaseClient'
import Layout from '../components/Layout'
import resolveTheme from '../styles/theme'
import isDevelopment from '../utils/isDevelopment'
import { ThemeProvider } from '@mui/material/styles'
import useColorScheme from '../utils/useColorScheme'
import { ColorSchemeSetting } from '../types'
import { AuthProvider } from '../utils/auth/AuthContext'
import getAuthFromCookies from '../utils/auth/getAuthFromCookies'
import { Auth } from '../types/Auth'
import { useRouter } from 'next/router'
import { send } from 'process'

initFirebaseClient()

const assistant = Assistant({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
})

const GOOGLE_TAG_MANAGER_ID = process.env
  .NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID as string

type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type Props = AppProps & {
  Component: NextPageWithLayout
  colorSchemeCookie?: ColorSchemeSetting
  auth: Auth
}

const App = (props: Props) => {
  const { events } = useRouter()
  const { Component, pageProps, colorSchemeCookie, auth } = props

  const { value: colorScheme } = useColorScheme({
    ssrValue: colorSchemeCookie,
  })

  const theme = resolveTheme({ colorScheme, fontStyles: assistant.style })
  const getLayout = Component.getLayout ?? (page => <Layout>{page}</Layout>)

  useEffect(() => {
    const handleRouteChangeStart = () => {
      sendGTMEvent(() => {
        window.google_tag_manager[GOOGLE_TAG_MANAGER_ID].dataLayer.reset()
      })
    }

    const handleRouteChangeComplete = () => {
      sendGTMEvent({ event: 'page_view' })
    }

    events.on('routeChangeStart', handleRouteChangeStart)
    events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      events.off('routeChangeStart', handleRouteChangeStart)
      events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [events])

  return (
    <>
      {!isDevelopment && GOOGLE_TAG_MANAGER_ID && (
        <GoogleTagManager gtmId={GOOGLE_TAG_MANAGER_ID} />
      )}
      <AppCacheProvider {...props}>
        <AuthProvider auth={auth}>
          <ReduxProvider store={store}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
          </ReduxProvider>
        </AuthProvider>
      </AppCacheProvider>
    </>
  )
}

App.getInitialProps = async ({ ctx }: AppContext) => {
  const { cookie } = ctx.req?.headers ?? {}
  const cookies = cookie ? qs.decode(cookie, '; ') : {}
  const auth = await getAuthFromCookies(cookies as Record<string, string>)
  const colorSchemeCookie = cookies.colorScheme as ColorSchemeSetting

  return {
    colorSchemeCookie,
    auth,
  }
}

export default App
