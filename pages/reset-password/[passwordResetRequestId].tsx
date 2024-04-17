import { ReactElement } from 'react'
import { AuthAction, withUser, withUserTokenSSR } from 'next-firebase-auth'
import constants from '../../constants'
import { checkPasswordResetRequestValid } from '../../utils/callableFirebaseFunctions'
import LayoutBasicSlimBranded from '../../components/LayoutBasicSlimBranded'
import ResetPasswordPage from '../../components/ResetPasswordPage'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

export enum RequestIdStatus {
  UNKNOWN_ERROR = 'error',
  INVALID = 'invalid',
  USED = 'used',
  VALID = 'valid',
}

export type RequestIdStatuses = `${RequestIdStatus}`

interface Props {
  requestId: string
  requestIdStatus: RequestIdStatuses
}

const ResetPassword = ({ requestId, requestIdStatus }: Props) => (
  <ResetPasswordPage requestId={requestId} requestIdStatus={requestIdStatus} />
)

ResetPassword.getLayout = (page: ReactElement) => (
  <LayoutBasicSlimBranded>{page}</LayoutBasicSlimBranded>
)

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
  whenUnauthed: AuthAction.RENDER,
})(async ({ params }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const encodedPasswordResetRequestId = params?.passwordResetRequestId as
    | string
    | undefined

  if (!encodedPasswordResetRequestId) {
    return { notFound: true }
  }

  const passwordResetRequestId = decodeURIComponent(
    encodedPasswordResetRequestId
  )

  try {
    await checkPasswordResetRequestValid({ passwordResetRequestId })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
})

export default withUser<Props>({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RENDER,
})(ResetPassword)
