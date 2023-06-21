import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthUser,
  getFirebaseAdmin,
} from 'next-firebase-auth'

import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import { checkUserHasPassword } from '../../utils/callableFirebaseFunctions'
import constants from '../../constants'
import PasswordPage from '../../components/PasswordPage'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface Props {
  userHasPassword: boolean
}

const Password = ({ userHasPassword }: Props) => (
  <PasswordPage userHasPassword={userHasPassword} />
)

const getServerSidePropsFn = async ({ AuthUser }: { AuthUser: AuthUser }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const userHasUsername = await checkIfUserHasUsername(uid, { db: adminDb })

  if (uid && !userHasUsername) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      redirect: {
        destination: '/sign-up/username',
        permanent: false,
      },
    }
  }

  const { data: userHasPassword } = await checkUserHasPassword({
    uid: AuthUser.id as string,
  })

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      userHasPassword,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Password as any
)
