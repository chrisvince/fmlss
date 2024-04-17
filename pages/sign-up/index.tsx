import { AuthAction, withUser, withUserTokenSSR } from 'next-firebase-auth'
import SignUpPage from '../../components/SignUpPage'
import LayoutBasicSlimBranded from '../../components/LayoutBasicSlimBranded'
import { ReactElement } from 'react'
import PageSpinner from '../../components/PageSpinner'

const SignUp = () => <SignUpPage />

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBasicSlimBranded>{page}</LayoutBasicSlimBranded>
}

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthed: AuthAction.RENDER,
})()

export default withUser({
  LoaderComponent: PageSpinner,
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedAfterInit: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(SignUp)
