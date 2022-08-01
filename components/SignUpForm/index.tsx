import React, { SyntheticEvent, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import GoogleAuthButton from '../GoogleAuthButton'
import Link from 'next/link'
import { Box } from '@mui/system'
import {
  Button,
  Divider,
  TextField,
  Typography,
  Link as MuiLink,
} from '@mui/material'

const auth = firebase.auth()

const UI_STATES = {
  EMAIL_IN_USE_ERROR: 'email-in-use-error',
  ERROR: 'error',
  LOADING: 'loading',
  NOT_SUBMITTED: 'not-submitted',
}

const EMAIL_ID = 'email'
const EMAIL_LABEL = 'Email'

const PASSWORD_ID = 'password'
const PASSWORD_LABEL = 'Password'

const SignUpForm = () => {
  const [uiState, setUiState] = useState(UI_STATES.NOT_SUBMITTED)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get(EMAIL_ID) as string | undefined
    const password = formData.get(PASSWORD_ID) as string | undefined

    try {
      setErrorMessage(null)
      setUiState(UI_STATES.LOADING)
      await auth.createUserWithEmailAndPassword(
        email as string,
        password as string,
      )
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setUiState(UI_STATES.EMAIL_IN_USE_ERROR)
        return
      }
      setErrorMessage(
        error.message ?? 'There was an error. Please try again later.'
      )
      setUiState(UI_STATES.ERROR)
      console.error(error)
    }
  }

  const handleGoogleAuthError = () => setUiState(UI_STATES.ERROR)
  const formDisabled = uiState === UI_STATES.LOADING

  return (
    <Box
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 8,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: 6,
        }}
      >
        <GoogleAuthButton
          disabled={formDisabled}
          mode="signUp"
          onAuthError={handleGoogleAuthError}
        />
        <Divider>
          <Typography variant="body2" color="action.active">
            or
          </Typography>
        </Divider>
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            gap: 2,
            '& *:first-child': {
              marginTop: 0,
            },
          }}
        >
          <TextField
            disabled={formDisabled}
            fullWidth
            id={EMAIL_ID}
            label={EMAIL_LABEL}
            name={EMAIL_ID}
            type="email"
            variant="outlined"
          />
          <TextField
            disabled={formDisabled}
            fullWidth
            id={PASSWORD_ID}
            label={PASSWORD_LABEL}
            name={PASSWORD_ID}
            type="password"
            variant="outlined"
          />
          <Button
            disabled={formDisabled}
            type="submit"
            variant="contained"
          >
            Sign up
          </Button>
          {uiState === UI_STATES.ERROR && (
            <Typography variant="caption" color="error">
              {errorMessage}
            </Typography>
          )}
          {uiState === UI_STATES.EMAIL_IN_USE_ERROR && (
            <Typography variant="caption" color="error">
              The email is already in use.{' '}
              <Link href="/" passHref>
                <MuiLink>Sign in</MuiLink>
              </Link>
            </Typography>
          )}
        </Box>
      </Box>
      <Box>
        <Box>
          <Link href="/forgot-password" passHref>
            <MuiLink variant="body2">Forgot password?</MuiLink>
          </Link>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link href="/" passHref>
              <MuiLink variant="body2">Sign in</MuiLink>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SignUpForm
