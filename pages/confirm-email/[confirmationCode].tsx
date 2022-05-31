import firebase from 'firebase/app'
import 'firebase/functions'
import { GetServerSidePropsContext } from 'next'

const verifyEmail = firebase.functions().httpsCallable('verifyEmail')

const UI_STATES = {
  VERIFIED: 'verified',
  ALREADY_VERIFIED: 'already-verified',
  ERROR: 'error',
}
type StatusKeys = keyof typeof UI_STATES
type StatusValues = typeof UI_STATES[StatusKeys]

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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { confirmationCode } = context.params ?? {}
  if (!confirmationCode) {
    return createGetServerSidePropsPayload(UI_STATES.ERROR)
  }

  try {
    await verifyEmail({ confirmationCode })
    return createGetServerSidePropsPayload(UI_STATES.VERIFIED)
  } catch (error: any) {
    if (error.code === 'already-exists') {
      return createGetServerSidePropsPayload(UI_STATES.ALREADY_VERIFIED)
    }
    return createGetServerSidePropsPayload(UI_STATES.ERROR)
  }
}

export default EmailConfirmation
