import { ReactElement } from 'react'
import ForgotPasswordPage from '../components/ForgotPasswordPage'
import LayoutBasicSlimBranded from '../components/LayoutBasicSlimBranded'

const ForgotPassword = () => <ForgotPasswordPage />

ForgotPassword.getLayout = (page: ReactElement) => (
  <LayoutBasicSlimBranded>{page}</LayoutBasicSlimBranded>
)

export default ForgotPassword
