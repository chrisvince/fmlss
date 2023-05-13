import { ReactElement } from 'react'
import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'

import ForgotPasswordPage from '../components/ForgotPasswordPage'
import LayoutBasicSlimBranded from '../components/LayoutBasicSlimBranded'

const ForgotPassword = () => <ForgotPasswordPage />

ForgotPassword.getLayout = (page: ReactElement) => (
  <LayoutBasicSlimBranded>{page}</LayoutBasicSlimBranded>
)

export const getServerSideProps = withAuthUserTokenSSR()()
export default withAuthUser()(ForgotPassword)
