import React, { useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import Link from 'next/link'
import { Box } from '@mui/system'
import { Divider, TextField, Typography, Button } from '@mui/material'
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

const FORM_IDS = {
  EMAIL: 'email',
  PASSWORD: 'password',
}

const GENERIC_ERROR_MESSAGE =
  'There was an error signing you up. Please try again later.'

interface Props {
  onSuccess?: () => any
}

const SignUpForm = ({ onSuccess }: Props) => {
  const auth = firebase.auth()
  const [formError, setFormError] = useState<{ message: string } | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { control, handleSubmit, setError } = useForm()
  const handleGoogleAuthSuccess = () => onSuccess?.()

  const onSubmit = async (data: FieldValues) => {
    const email = data[FORM_IDS.EMAIL] as string
    const password = data[FORM_IDS.PASSWORD] as string

    setFormError(null)
    setIsLoading(true)
    try {
      await createUser({ email, password })
      await auth.signInWithEmailAndPassword(email, password)
      onSuccess?.()
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
          onAuthSuccess={handleGoogleAuthSuccess}
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
                message: FORM_MESSAGING.EMAIL.VALID,
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
                message: FORM_MESSAGING.PASSWORD.PATTERN,
              },
              minLength: {
                value: PASSWORD_MIN_LENGTH,
                message: FORM_MESSAGING.PASSWORD.MIN_LENGTH,
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              gap: 4,
            }}
          >
            <Box>
              <LoadingButton
                fullWidth
                loading={isLoading}
                type="submit"
                variant="contained"
              >
                Create account
              </LoadingButton>
              {formError && (
                <Typography variant="caption" color="error">
                  {formError.message}
                </Typography>
              )}
            </Box>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <Typography variant="body1" component="h2">
                Already have an account?{' '}
              </Typography>
              <Button
                component={Link}
                fullWidth
                href="/"
                variant="outlined"
              >
                Sign in
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SignUpForm
