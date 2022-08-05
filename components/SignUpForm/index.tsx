import React, { useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import Link from 'next/link'
import { Box } from '@mui/system'
import { Divider, TextField, Typography, Link as MuiLink } from '@mui/material'
import { Controller, FieldValues, useForm } from 'react-hook-form'

import GoogleAuthButton from '../GoogleAuthButton'
import { createUser } from '../../utils/callableFirebaseFunctions'
import constants from '../../constants'
import { LoadingButton } from '@mui/lab'

const {
  EMAIL_REGEX_PATTERN,
  FORM_MESSAGING,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX_PATTERN,
} = constants

const auth = firebase.auth()

const FORM_IDS = {
  EMAIL: 'email',
  PASSWORD: 'password',
}

const GENERIC_ERROR_MESSAGE =
  'There was an error signing you up. Please try again later.'

const SignUpForm = () => {
  const [formError, setFormError] = useState<{ message: string } | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { control, handleSubmit, setError } = useForm()

  const onSubmit = async (data: FieldValues) => {
    const email = data[FORM_IDS.EMAIL] as string
    const password = data[FORM_IDS.PASSWORD] as string

    setFormError(null)
    setIsLoading(true)
    try {
      await createUser({ email, password })
      await auth.signInWithEmailAndPassword(email, password)
    } catch (error: any) {
      if (error.code === 'already-exists') {
        setError(FORM_IDS.EMAIL, { message: 'This email is already in use.' })
        setIsLoading(false)
        return
      }
      setFormError({
        message: GENERIC_ERROR_MESSAGE,
      })
      setIsLoading(false)
    }
  }

  const handleGoogleAuthError = () =>
    setFormError({ message: GENERIC_ERROR_MESSAGE })

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: 3,
        }}
      >
        <GoogleAuthButton
          disabled={isLoading}
          mode="signUp"
          onAuthError={handleGoogleAuthError}
        />
        <Divider>
          <Typography variant="body2" color="action.active">
            or
          </Typography>
        </Divider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            gap: 2,
            '& *:first-of-type': {
              marginTop: 0,
            },
          }}
        >
          <Controller
            name={FORM_IDS.EMAIL}
            control={control}
            defaultValue=""
            rules={{
              required: FORM_MESSAGING.REQUIRED,
              pattern: {
                value: EMAIL_REGEX_PATTERN,
                message: FORM_MESSAGING.VALID_EMAIL,
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                {...field}
                disabled={isLoading}
                label="Email"
                type="email"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name={FORM_IDS.PASSWORD}
            control={control}
            defaultValue=""
            rules={{
              required: FORM_MESSAGING.REQUIRED,
              pattern: {
                value: PASSWORD_REGEX_PATTERN,
                message: FORM_MESSAGING.PATTERN,
              },
              minLength: {
                value: PASSWORD_MIN_LENGTH,
                message: FORM_MESSAGING.MIN_LENGTH,
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                {...field}
                disabled={isLoading}
                label="Password"
                type="password"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Box>
            <LoadingButton
              fullWidth
              loading={isLoading}
              type="submit"
              variant="contained"
            >
              Sign up
            </LoadingButton>
            {formError && (
              <Typography variant="caption" color="error">
                {formError.message}
              </Typography>
            )}
          </Box>
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
