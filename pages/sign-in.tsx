import SignInPage from '../components/SignInPage'
import { ReactElement } from 'react'
import LayoutBasicCentered from '../components/LayoutBasicCentered'

const SignIn = () => <SignInPage />

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBasicCentered>{page}</LayoutBasicCentered>
}

export default SignIn
