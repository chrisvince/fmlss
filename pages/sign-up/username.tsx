import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { ReactElement } from 'react'

import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import CreateUsernamePage from '../../components/CreateUsernamePage'
import LayoutBasicSlimBranded from '../../components/LayoutBasicSlimBranded'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const Username = () => <CreateUsernamePage />

Username.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBasicSlimBranded>{page}</LayoutBasicSlimBranded>
}

const getServersidePropsFn = async ({ AuthUser }: { AuthUser: AuthUser }) => {
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const userHasUsername = await checkIfUserHasUsername(uid, { db: adminDb })

  if (userHasUsername) {
    return {
      redirect: {
        destination: '/feed',
        permanent: false,
      },
    }
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServersidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Username)
