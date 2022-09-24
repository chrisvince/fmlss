import { Box } from '@mui/system'
import React, { useState } from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'

import { forgotPassword } from '../../utils/callableFirebaseFunctions'
import constants from '../../constants'
import { Button, Divider, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Link from 'next/link'

const { FORM_MESSAGING, EMAIL_REGEX_PATTERN } = constants

const EMAIL_ID = 'email'

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [formError, setFormError] = useState<{ message: string } | null>(null)

  const { control, handleSubmit } = useForm()

  const onSubmit = async (data: FieldValues) => {
    const email = data[EMAIL_ID] as string
    setFormError(null)
    setIsLoading(true)

    try {
      await forgotPassword({ email })
      setSubmitted(true)
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setFormError({
        message:
          'There was an issue resetting your password. Please try again.',
      })
    }
  }

  if (submitted) {
    return (
      <Typography variant="body2">
        Thanks! Your password reset request has been recieved.
        <br/>
        If an account
        exists, you will recieve an email.
      </Typography>
    )
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
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
            <Box>
              <LoadingButton
                fullWidth
                loading={isLoading}
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
            <Link href="/" passHref>
              <Button variant="outlined" fullWidth>Sign in</Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ForgotPasswordForm
