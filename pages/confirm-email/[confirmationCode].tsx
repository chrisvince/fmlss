import constants from '../../constants'
import { verifyEmail } from '../../utils/callableFirebaseFunctions'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const UI_STATES = {
  VERIFIED: 'verified',
  ALREADY_VERIFIED: 'already-verified',
  ERROR: 'error',
}
type StatusKeys = keyof typeof UI_STATES
type StatusValues = (typeof UI_STATES)[StatusKeys]

const createGetServerSidePropsPayload = (emailVerificationStatus: string) => ({
  props: {
    emailVerificationStatus,
  },
})

const EmailConfirmation = ({
  emailVerificationStatus,
}: {
  emailVerificationStatus: StatusValues
}) => {
  switch (emailVerificationStatus) {
    case UI_STATES.ERROR:
      return <p>There was an error verifying your email.</p>

    case UI_STATES.ALREADY_VERIFIED:
      return <p>Your email has already been verified.</p>

    case UI_STATES.VERIFIED:
      return <p>Your email has been verified.</p>

    default:
      return <p>There was an error verifying your email.</p>
  }
}

export const getServerSideProps = async ({
  params: { confirmationCode: encodedConfirmationCode },
}: {
  params: {
    confirmationCode: string
  }
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  if (!encodedConfirmationCode) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return createGetServerSidePropsPayload(UI_STATES.ERROR)
  }

  try {
    const confirmationCode = decodeURIComponent(encodedConfirmationCode)
    await verifyEmail({ confirmationCode })
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return createGetServerSidePropsPayload(UI_STATES.VERIFIED)
  } catch (error: any) {
    if (error.code === 'already-exists') {
      console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
      return createGetServerSidePropsPayload(UI_STATES.ALREADY_VERIFIED)
    }
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return createGetServerSidePropsPayload(UI_STATES.ERROR)
  }
}

export default EmailConfirmation
