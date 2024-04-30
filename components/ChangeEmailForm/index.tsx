import { useState } from 'react'
import { Box } from '@mui/system'
import { TextField, Typography } from '@mui/material'
import { Controller, FieldValues, useForm } from 'react-hook-form'

import { changeEmail } from '../../utils/callableFirebaseFunctions/changeEmail'
import constants from '../../constants'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import signInWithEmailAndPassword from '../../utils/auth/signInWithEmailAndPassword'
import useAuth from '../../utils/auth/useAuth'

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

const ChangeEmailForm = () => {
  const router = useRouter()
  const { email: currentEmail } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [formError, setFormError] = useState<{ message: string } | null>(null)
  const { control, handleSubmit, setError } = useForm()

  const onSubmit = async (data: FieldValues) => {
    const email = data[FORM_IDS.EMAIL] as string
    const password = data[FORM_IDS.PASSWORD] as string

    if (email === currentEmail) {
      setError(FORM_IDS.EMAIL, {
        message: 'The email must be different from the current email.',
      })
      return
    }

    setFormError(null)
    setIsLoading(true)

    try {
      await changeEmail({ email, password })
      await signInWithEmailAndPassword(email, password)
      setSubmitted(true)
      setIsLoading(false)
      router.reload()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        error.code === 'invalid-argument' &&
        error.message === '`password` is incorrect.'
      ) {
        setError(FORM_IDS.PASSWORD, {
          message: 'The password entered is incorrect.',
        })
        setIsLoading(false)
        return
      }

      if (
        error.code === 'invalid-argument' &&
        error.message === '`email` must be different from the current email.'
      ) {
        setError(FORM_IDS.EMAIL, {
          message: 'The email must be different from the current email.',
        })
        setIsLoading(false)
        return
      }

      if (error.code === 'already-exists') {
        setError(FORM_IDS.EMAIL, {
          message: 'This email is already in use. Please try another email.',
        })
        setIsLoading(false)
        return
      }

      setFormError({
        message: 'There was an issue changing your email. Please try again.',
      })
      setIsLoading(false)
    }
  }

  if (submitted) {
    return <Typography variant="body2">Your email has been changed.</Typography>
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
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
        <Typography variant="body2">
          Enter a new email and current password below to change your email.
        </Typography>
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
              label="New email"
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
              label="Current password"
              type="password"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Box>
          <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            fullWidth
          >
            Save
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

export default ChangeEmailForm
