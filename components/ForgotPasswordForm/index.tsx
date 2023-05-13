import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'

import { forgotPassword } from '../../utils/callableFirebaseFunctions'
import constants from '../../constants'
import { Button, Divider, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Link from 'next/link'
import TextAndCta from '../TextAndCta'
import { useAuthUser } from 'next-firebase-auth'
import PageSpinner from '../PageSpinner'

const { FORM_MESSAGING, EMAIL_REGEX_PATTERN } = constants

const EMAIL_ID = 'email'
const EMAIL_LABEL = 'Email'

const ForgotPasswordForm = () => {
  const [formIsLoading, setFormIsLoading] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [formError, setFormError] = useState<{ message: string } | null>(null)
  const { control, handleSubmit } = useForm()
  const { email: authEmail } = useAuthUser()

  const performRequest = async ({ email }: { email: string }) => {
    try {
      await forgotPassword({ email })
      setSubmitted(true)
      setFormIsLoading(false)
    } catch (error) {
      console.error(error)
      setFormError({
        message:
          'There was an issue resetting your password. Please try again later.',
      })
    }
  }

  const onSubmit = async (data: FieldValues) => {
    const email = data[EMAIL_ID] as string
    setFormError(null)
    setFormIsLoading(true)
    await performRequest({ email })
  }

  useEffect(() => {
    if (!authEmail) return
    performRequest({ email: authEmail })
  }, [authEmail])

  if (submitted) {
    return (
      <TextAndCta
        ctaHref={authEmail ? '/profile' : '/'}
        ctaText={authEmail ? 'Go to profile' : 'Sign in'}
        message={`Your password reset request has been recieved. ${
          authEmail ? 'Y' : 'If an account exists, y'
        }ou will recieve an email with instructions to reset your password.`}
      />
    )
  }

  if (authEmail && formError) {
    return (
      <TextAndCta
        ctaHref="/"
        ctaText="Go to sign in"
        message={formError.message}
        variant="error"
      />
    )
  }

  if (authEmail && !submitted) {
    return <PageSpinner />
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="body1" component="h1">
          Forgot password
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            gap: 6,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              gap: 4,
            }}
          >
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
                name={EMAIL_ID}
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
                    disabled={formIsLoading}
                    label={EMAIL_LABEL}
                    type="email"
                    variant="outlined"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Box>
                <LoadingButton
                  fullWidth
                  loading={formIsLoading}
                  type="submit"
                  variant="contained"
                >
                  Reset password
                </LoadingButton>
                {formError && (
                  <Typography variant="caption" color="error">
                    {formError.message}
                  </Typography>
                )}
              </Box>
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
              <Typography variant="body1" component="h1">
                Already know your password?
              </Typography>
              <Button component={Link} fullWidth href="/" variant="outlined">
                Sign in
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ForgotPasswordForm
