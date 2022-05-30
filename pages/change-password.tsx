import firebase from 'firebase'
import 'firebase/functions'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthUser,
} from 'next-firebase-auth'
import ChangePasswordForm from '../components/ChangePasswordForm'
import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../config/withAuthConfig'

const functions = firebase.functions()
const checkUserHasPassword = functions.httpsCallable('checkUserHasPassword')

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

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

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(
  ChangePassword as any
)
