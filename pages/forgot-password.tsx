import { ReactElement } from 'react'
import { withUser, withUserTokenSSR } from 'next-firebase-auth'

import ForgotPasswordPage from '../components/ForgotPasswordPage'
import LayoutBasicSlimBranded from '../components/LayoutBasicSlimBranded'

const ForgotPassword = () => <ForgotPasswordPage />

ForgotPassword.getLayout = (page: ReactElement) => (
  <LayoutBasicSlimBranded>{page}</LayoutBasicSlimBranded>
)

export const getServerSideProps = withUserTokenSSR()()
export default withUser()(ForgotPassword)
