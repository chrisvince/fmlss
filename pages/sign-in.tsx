import LayoutBasicBranded from '../components/LayoutBasicBranded'
import { ReactElement } from 'react'
import SignInPage from '../components/SignInPage'

const SignIn = () => <SignInPage />

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBasicBranded>{page}</LayoutBasicBranded>
}

export default SignIn
