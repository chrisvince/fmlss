import { ReactElement } from 'react'
import ForgotPasswordPage from '../components/ForgotPasswordPage'
import LayoutBasicBranded from '../components/LayoutBasicBranded'

const ForgotPassword = () => <ForgotPasswordPage />

ForgotPassword.getLayout = (page: ReactElement) => (
  <LayoutBasicBranded>{page}</LayoutBasicBranded>
)

export default ForgotPassword
