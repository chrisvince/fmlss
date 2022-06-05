import React, { SyntheticEvent, useState } from 'react'

import { forgotPassword } from '../../utils/callableFirebaseFunctions'

const UI_STATES = {
  NOT_SUBMITTED: 'not-submitted',
  LOADING: 'loading',
  ERROR: 'error',
  SUBMITTED: 'submitted',
}

const EMAIL_ID = 'email'
const EMAIL_LABEL = 'Email'

const ForgotPasswordForm = () => {
  const [uiState, setUiState] = useState(UI_STATES.NOT_SUBMITTED)
  const handleFormSubmit = async (event: SyntheticEvent) => {
    setUiState(UI_STATES.LOADING)
    event.preventDefault()
    try {
      const formData = new FormData(event.target as HTMLFormElement)
      const email = formData.get(EMAIL_ID) as string | undefined
      if (!email) {
        console.error('Must have an email')
        return
      }
      await forgotPassword({ email })
      setUiState(UI_STATES.SUBMITTED)
    } catch (error) {
      console.error(error)
      setUiState(UI_STATES.ERROR)
    }
  }

  if (uiState === UI_STATES.LOADING) {
    return <p>Loading...</p>
  }

  if (uiState === UI_STATES.SUBMITTED) {
    return (
      <p>
        Your forgot password request was sent. If an account matching the email
        entered exists, you will recieve an email.
      </p>
    )
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor={EMAIL_ID}>
          {EMAIL_LABEL}
        </label>
        <input type="email" id={EMAIL_ID} name={EMAIL_ID} />
      </div>
      <button type="submit">Submit</button>
      {uiState === UI_STATES.ERROR && (
        <p>There was an error, please try again.</p>
      )}
    </form>
  )
}

export default ForgotPasswordForm
