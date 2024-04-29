import LayoutBasicSlimBranded from '../components/LayoutBasicSlimBranded'
import { ReactElement } from 'react'
import SignInPage from '../components/SignInPage'

const SignIn = () => <SignInPage />

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBasicSlimBranded>{page}</LayoutBasicSlimBranded>
}

export default SignIn
