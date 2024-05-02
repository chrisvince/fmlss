import SignUpPage from '../../components/SignUpPage'
import LayoutBasicBranded from '../../components/LayoutBasicBranded'
import { ReactElement } from 'react'

const SignUp = () => <SignUpPage />

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBasicBranded>{page}</LayoutBasicBranded>
}

export default SignUp
