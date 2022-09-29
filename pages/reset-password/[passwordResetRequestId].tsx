import { GetServerSidePropsContext } from 'next'
import { ReactElement } from 'react'
import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import constants from '../../constants'
import { checkPasswordResetRequestValid } from '../../utils/callableFirebaseFunctions'
import LayoutBasicSlimBranded from '../../components/LayoutBasicSlimBranded'
import ResetPasswordPage from '../../components/ResetPasswordPage'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants
const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

export enum RequestIdStatus {
  UNKNOWN_ERROR = 'error',
  INVALID = 'invalid',
  USED = 'used',
  VALID = 'valid',
}

export type RequestIdStatuses = `${RequestIdStatus}`

const ResetPassword = ({ requestId, requestIdStatus }: {
  requestId: string
  requestIdStatus: RequestIdStatuses
}) => (
  <ResetPasswordPage
    requestId={requestId}
    requestIdStatus={requestIdStatus}
  />
)

const getServerSidePropsFn = async ({
  params: { passwordResetRequestId: encodedPasswordResetRequestId } = {},
}: GetServerSidePropsContext<{ passwordResetRequestId?: string }>) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  const passwordResetRequestId = decodeURIComponent(
    encodedPasswordResetRequestId!
  )

  try {
    await checkPasswordResetRequestValid({ passwordResetRequestId })
  } catch (error: any) {
    switch (error.code) {
      case 'not-found': {
        console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
        return {
          props: {
            requestId: passwordResetRequestId,
            requestIdStatus: RequestIdStatus.INVALID,
          },
        }
      }

      case 'resource-exhausted': {
        console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
        return {
          props: {
            requestId: passwordResetRequestId,
            requestIdStatus: RequestIdStatus.USED,
          },
        }
      }

      default: {
        console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
        return {
          props: {
            requestId: passwordResetRequestId,
            requestIdStatus: RequestIdStatus.UNKNOWN_ERROR,
          },
        }
      }
    }
  }

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      requestId: passwordResetRequestId,
      requestIdStatus: RequestIdStatus.VALID,
    },
  }
}

ResetPassword.getLayout = (page: ReactElement) => (
  <LayoutBasicSlimBranded>{page}</LayoutBasicSlimBranded>
)

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(
  ResetPassword as any
)
