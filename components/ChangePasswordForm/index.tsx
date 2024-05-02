import { useState } from 'react'
import { Box } from '@mui/system'
import { TextField, Typography, Link as MuiLink } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Link from 'next/link'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { changePassword } from '../../utils/callableFirebaseFunctions'
import constants from '../../constants'
import signInWithEmailAndPassword from '../../utils/auth/signInWithEmailAndPassword'
import { useRouter } from 'next/router'
import useAuth from '../../utils/auth/useAuth'

const { PASSWORD_MIN_LENGTH, PASSWORD_REGEX_PATTERN, FORM_MESSAGING } =
  constants

const FORM_IDS = {
  CURRENT_PASSWORD: 'current-password',
  NEW_PASSWORD: 'new-password',
  CONFIRM_NEW_PASSWORD: 'confirm-new-password',
}

interface PropTypes {
  userHasPassword: boolean
}

const ChangePasswordForm = ({ userHasPassword }: PropTypes) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<{ message: string } | null>(null)
  const user = useAuth()
  const { handleSubmit, control, setError, getValues } = useForm()

  const onSubmit = async (data: FieldValues) => {
    if (!user || !user?.email) return
    const currentPassword = data[FORM_IDS.CURRENT_PASSWORD]
    const newPassword = data[FORM_IDS.NEW_PASSWORD]
    const confirmNewPassword = data[FORM_IDS.CONFIRM_NEW_PASSWORD]

    setFormError(null)
    setIsLoading(true)

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      })
      await signInWithEmailAndPassword(user.email, newPassword)
      setSubmitted(true)
      setIsLoading(false)
      router.reload()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        error.code === 'functions/invalid-argument' &&
        error.message === '`currentPassword` is incorrect.'
      ) {
        setError(FORM_IDS.CURRENT_PASSWORD, {
          message: 'The current password you entered is incorrect.',
        })
        setIsLoading(false)
        return
      }
      setFormError({
        message: 'There was an issue changing your password. Please try again.',
      })
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <Typography variant="body2">Your password has been changed.</Typography>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: 2,
        }}
      >
        <Typography variant="body2">
          {userHasPassword
            ? 'Enter your current and new password below to change your password.'
            : 'Enter your new password to secure your account.'}
        </Typography>
        {userHasPassword && (
          <Box>
            <Controller
              name={FORM_IDS.CURRENT_PASSWORD}
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
            <MuiLink component={Link} href="/forgot-password" variant="caption">
              Forgot password?
            </MuiLink>
          </Box>
        )}
        <Controller
          name={FORM_IDS.NEW_PASSWORD}
          control={control}
          defaultValue=""
          rules={{
            required: FORM_MESSAGING.REQUIRED,
            minLength: {
              value: PASSWORD_MIN_LENGTH,
              message: FORM_MESSAGING.PASSWORD.MIN_LENGTH,
            },
            pattern: {
              value: PASSWORD_REGEX_PATTERN,
              message: FORM_MESSAGING.PASSWORD.PATTERN,
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
              message: FORM_MESSAGING.PASSWORD.PATTERN,
            },
            minLength: {
              value: PASSWORD_MIN_LENGTH,
              message: FORM_MESSAGING.PASSWORD.MIN_LENGTH,
            },
            validate: (value: string) => {
              const newPassword = getValues(FORM_IDS.NEW_PASSWORD)
              if (newPassword === value) return
              return FORM_MESSAGING.PASSWORD.MATCH
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
        {formError && (
          <Typography variant="caption" color="error" component="div" mb={1}>
            {formError.message}
          </Typography>
        )}
        <LoadingButton
          fullWidth
          loading={isLoading}
          type="submit"
          variant="contained"
        >
          Save
        </LoadingButton>
      </Box>
    </Box>
  )
}

export default ChangePasswordForm
