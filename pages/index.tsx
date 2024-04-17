import { AuthAction, withUser, withUserTokenSSR } from 'next-firebase-auth'

import SignInPage from '../components/SignInPage'
import { ReactElement } from 'react'
import LayoutBasicCentered from '../components/LayoutBasicCentered'
import PageSpinner from '../components/PageSpinner'

const SignIn = () => {
  return <SignInPage />
}

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBasicCentered>{page}</LayoutBasicCentered>
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
})(SignIn)
