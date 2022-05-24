import firebase from 'firebase'
import 'firebase/functions'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
  AuthUser,
} from 'next-firebase-auth'
import ChangePasswordForm from '../components/ChangePasswordForm'

const functions = firebase.functions()
const checkUserHasPassword = functions.httpsCallable('checkUserHasPassword')

interface PropTypes {
  userHasPassword: boolean
}

const ChangePassword = ({ userHasPassword }: PropTypes) => {
  return (
    <div>
      <h1>{userHasPassword ? 'Change password' : 'Create password'}</h1>
      <ChangePasswordForm userHasPassword={userHasPassword} />
    </div>
  )
}

const getServerSidePropsFn = async ({ AuthUser }: { AuthUser: AuthUser }) => {
  const response = await checkUserHasPassword({ uid: AuthUser.id })
  const userHasPassword = response.data
  return {
    props: {
      userHasPassword,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(getServerSidePropsFn as any)

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ChangePassword as any)
