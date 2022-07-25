import type { AppProps } from 'next/app'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { withAuthUser } from 'next-firebase-auth'

import initAuth from '../utils/initAuth'
import initFirebase from '../utils/initFirebase'
import Layout from '../components/Layout'
import { light } from '../styles/theme'

initFirebase()
initAuth()

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={light}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default withAuthUser()(App as any)
