import React, { SyntheticEvent, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import Link from 'next/link'
import {
  Button,
  Divider,
  TextField,
  Typography,
  Link as MuiLink,
} from '@mui/material'
import { Box } from '@mui/system'

import GoogleAuthButton from '../GoogleAuthButton'

const auth = firebase.auth()

const UI_STATES = {
  NOT_SUBMITTED: 'not-submitted',
  LOADING: 'loading',
  CREDENTIAL_ERROR: 'credential-error',
  ERROR: 'error',
}

const CREDENTIAL_ERRORS = ['auth/wrong-password', 'auth/user-not-found']

const EMAIL_ID = 'email'
const EMAIL_LABEL = 'Email'

const PASSWORD_ID = 'password'
const PASSWORD_LABEL = 'Password'

const SignInForm = () => {
  const [uiState, setUiState] = useState(UI_STATES.NOT_SUBMITTED)

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get(EMAIL_ID) as string | undefined
    const password = formData.get(PASSWORD_ID) as string | undefined

    if (!email || !password) {
      setUiState(UI_STATES.CREDENTIAL_ERROR)
      return
    }

    try {
      setUiState(UI_STATES.LOADING)
      await auth.signInWithEmailAndPassword(email as string, password as string)
    } catch (error: any) {
      if (CREDENTIAL_ERRORS.includes(error.code)) {
        setUiState(UI_STATES.CREDENTIAL_ERROR)
        return
      }
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
          mode="signIn"
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
            Sign in
          </Button>
          {uiState === UI_STATES.CREDENTIAL_ERROR && (
            <Typography variant="caption" color="error">
              Your email or password is incorrect. Please try again.
            </Typography>
          )}
          {uiState === UI_STATES.ERROR && (
            <Typography variant="caption" color="error">
              There was an error. Please try again later.
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
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" passHref>
              <MuiLink variant="body2">Sign up</MuiLink>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SignInForm
