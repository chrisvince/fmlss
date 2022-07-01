import type { AppProps } from 'next/app'
import { ThemeProvider, CssBaseline } from '@mui/material'

import '../styles/global.css'
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

export default App
