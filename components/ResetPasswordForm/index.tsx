import { Box } from '@mui/system'
import React, { useState } from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { resetPassword } from '../../utils/callableFirebaseFunctions'
import constants from '../../constants'
import TextAndCta from '../TextAndCta'

const {
  FORM_MESSAGING,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX_PATTERN,
} = constants

const FORM_IDS = {
  NEW_PASSWORD: 'new-password',
  CONFIRM_NEW_PASSWORD: 'confirm-new-password',
}

interface Props {
  requestId: string
}

const ResetPasswordForm = ({ requestId }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [formError, setFormError] = useState<{ message: string } | null>()
  const { control, getValues, handleSubmit } = useForm()

  const handleFormSubmit = async (data: FieldValues) => {
    const newPassword = data[FORM_IDS.NEW_PASSWORD] as string
    const confirmNewPassword = data[FORM_IDS.CONFIRM_NEW_PASSWORD] as string
    setFormError(null)

    try {
      setIsLoading(true)
      await resetPassword({
        confirmNewPassword,
        newPassword,
        requestId,
      })
      setSubmitted(true)
      setIsLoading(false)
    } catch (error) {
      setFormError({ message: "There was an error resetting your password. Please try again later." })
      setIsLoading(false)
      console.error(error)
    }
  }

  if (submitted) {
    return (
      <TextAndCta
        message="Your password has been reset."
        ctaText="Go to sign in"
        ctaHref="/"
      />
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: 2,
        }}
      >
        <Typography variant="body1" component="h1">
          Reset your password
        </Typography>
        <Controller
          name={FORM_IDS.NEW_PASSWORD}
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
              label="New password"
              type="password"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name={FORM_IDS.CONFIRM_NEW_PASSWORD}
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
            validate: (value: string) => {
              const newPassword = getValues(FORM_IDS.NEW_PASSWORD)
              if (newPassword === value) return
              return FORM_MESSAGING.MATCH
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              {...field}
              disabled={isLoading}
              label="Confirm new password"
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
            Reset password
          </LoadingButton>
          {formError && (
            <Typography variant="caption" color="error">
              {formError.message}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ResetPasswordForm
