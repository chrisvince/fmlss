import PageSpinner from '../../components/PageSpinner'
import { RequestIdStatus, RequestIdStatuses } from '../../pages/reset-password/[passwordResetRequestId]'
import Page from '../Page'
import ResetPasswordForm from '../ResetPasswordForm'
import TextAndCta from '../TextAndCta'

const UI_STATES = {
  SUCCESS: 'success',
  UNKNOWN_ERROR: 'unknown-error',
  INVALID_CODE: 'invalid-code',
  LOADING: 'loading',
  PASSWORD_MATCH_ERROR: 'password-match-error',
  REQUEST_ID_USED: 'request-id-used',
  FORM: 'form',
}

interface Props {
  requestId: string | null
  requestIdStatus: RequestIdStatuses
}

const mapRequestIdStatusToInitialUiState = (
  requestIdStatus: RequestIdStatuses
) => ({
  [RequestIdStatus.INVALID]: UI_STATES.INVALID_CODE,
  [RequestIdStatus.UNKNOWN_ERROR]: UI_STATES.UNKNOWN_ERROR,
  [RequestIdStatus.USED]: UI_STATES.REQUEST_ID_USED,
  [RequestIdStatus.VALID]: UI_STATES.FORM,
}[requestIdStatus])

const Layout = ({ children }: { children: React.ReactNode }) => (
  <Page
    layout="none"
    noPageTitle
    pageTitle="Forgot Password"
    thinContainer
  >
    {children}
  </Page>
)

const ResetPasswordPage = ({ requestId, requestIdStatus }: Props) => {
  const uiState = mapRequestIdStatusToInitialUiState(requestIdStatus)

  switch (uiState) {
    case UI_STATES.INVALID_CODE: {
      return (
        <Layout>
          <TextAndCta
            message="The password reset link you used is invalid."
            ctaText="Go to sign in"
            ctaHref="/"
          />
        </Layout>
      )
    }

    case UI_STATES.LOADING: {
      return <PageSpinner />
    }

    case UI_STATES.UNKNOWN_ERROR: {
      return (
        <Layout>
          <TextAndCta
            message="There was an error resetting your password."
            ctaText="Go to sign in"
            ctaHref="/"
          />
        </Layout>
      )
    }

    case UI_STATES.FORM:
    case UI_STATES.PASSWORD_MATCH_ERROR: {
      return (
        <Layout>
          <ResetPasswordForm requestId={requestId!} />
        </Layout>
      )
    }

    case UI_STATES.SUCCESS: {
      return (
        <Layout>
          <TextAndCta
            message="Your password has been updated."
            ctaText="Go to sign in"
            ctaHref="/"
          />
        </Layout>
      )
    }

    case UI_STATES.REQUEST_ID_USED: {
      return (
        <Layout>
          <TextAndCta
            message="This password reset request has already been used."
            ctaText="Go to sign in"
            ctaHref="/"
          />
        </Layout>
      )
    }

    default: {
      return (
        <Layout>
          <TextAndCta
            message="There was an error resetting your password."
            ctaText="Go to sign in"
            ctaHref="/"
          />
        </Layout>
      )
    }
  }
}

export default ResetPasswordPage
