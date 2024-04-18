import SignUpPage from '../../components/SignUpPage'
import LayoutBasicSlimBranded from '../../components/LayoutBasicSlimBranded'
import { ReactElement } from 'react'

const SignUp = () => <SignUpPage />

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBasicSlimBranded>{page}</LayoutBasicSlimBranded>
}

export default SignUp
