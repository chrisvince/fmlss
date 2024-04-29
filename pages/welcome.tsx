import WelcomePage from '../components/WelcomePage'
import { ReactElement } from 'react'
import LayoutBasicCentered from '../components/LayoutBasicCentered'

const SignIn = () => <WelcomePage />

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBasicCentered>{page}</LayoutBasicCentered>
}

export default SignIn
