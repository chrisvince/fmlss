import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthUser,
} from 'next-firebase-auth'

import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../../config/withAuthConfig'
import { checkUserHasPassword } from '../../utils/callableFirebaseFunctions'
import constants from '../../constants'
import ChangePasswordPage from '../../components/ChangePasswordPage'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface Props {
  userHasPassword: boolean
}

const ChangePassword = ({ userHasPassword }: Props) =>
  <ChangePasswordPage userHasPassword ={userHasPassword} />

const getServerSidePropsFn = async ({ AuthUser }: { AuthUser: AuthUser }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const response = await checkUserHasPassword({ uid: AuthUser.id as string })
  const userHasPassword = response.data
  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
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
