import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import { useState } from 'react'

import { sendEmailVerificationEmail } from '../../utils/callableFirebaseFunctions'

const UI_STATES = {
  NOT_SUBMITTED: 'not-submitted',
  LOADING: 'loading',
  SUBMITTED: 'submitted',
  ERROR: 'error',
}

const EmailVerificationLink = () => {
  const [uiState, setUiState] = useState(UI_STATES.NOT_SUBMITTED)

  const handleVerifyEmailClick = async () => {
    setUiState(UI_STATES.LOADING)
    try {
      await sendEmailVerificationEmail()
      setUiState(UI_STATES.SUBMITTED)
    } catch (error) {
      setUiState(UI_STATES.ERROR)
      console.error(error)
    }
  }

  if (uiState === UI_STATES.ERROR) {
    return (
      <Typography variant="caption" color="error">
        There was an error. Please try again.
      </Typography>
    )
  }

  if (uiState === UI_STATES.SUBMITTED) {
    return (
      <Typography variant="caption">
        You will receive a verification email.
      </Typography>
    )
  }

  return (
    <LoadingButton
      onClick={handleVerifyEmailClick}
      variant="outlined"
      loading={uiState === UI_STATES.LOADING}
    >
      <Typography variant="caption">Verify email</Typography>
    </LoadingButton>
  )
}

export default EmailVerificationLink
