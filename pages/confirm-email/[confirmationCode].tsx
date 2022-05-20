import firebase from 'firebase'
import 'firebase/functions'
import { GetServerSidePropsContext } from 'next'

const verifyEmail = firebase.functions().httpsCallable('verifyEmail')

const STATUS = {
  VERIFIED: 'verified',
  ALREADY_VERIFIED: 'already-verified',
  ERROR: 'error',
}
type StatusKeys = keyof typeof STATUS
type StatusValues = typeof STATUS[StatusKeys]


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
    case STATUS.ERROR:
      return <p>There was an error verifying your email.</p>

    case STATUS.ALREADY_VERIFIED:
      return <p>Your email has already been verified.</p>

    case STATUS.VERIFIED:
      return <p>Your email has been verified.</p>

    default:
      return <p>There was an error verifying your email.</p>
  }
}

export const getServerSideProps =
  async (context: GetServerSidePropsContext) => {
    const { confirmationCode } = context.params ?? {}
    if (!confirmationCode) {
      return createGetServerSidePropsPayload(STATUS.ERROR)
    }

    try {
      await verifyEmail({ confirmationCode })
    } catch (error: any) {
      if (error.code === 'already-exists') {
        return createGetServerSidePropsPayload(STATUS.ALREADY_VERIFIED)
      }
      return createGetServerSidePropsPayload(STATUS.ERROR)
    }
    return createGetServerSidePropsPayload(STATUS.VERIFIED)
  }

export default EmailConfirmation
