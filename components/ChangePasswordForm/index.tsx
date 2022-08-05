import { SyntheticEvent, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useAuthUser } from 'next-firebase-auth'
import { Box } from '@mui/system'
import { TextField, Typography, Link as MuiLink } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Link from 'next/link'
import { Controller, FieldValues, useForm } from 'react-hook-form'

import { changePassword } from '../../utils/callableFirebaseFunctions'
import constants from '../../constants'

const { PASSWORD_MIN_LENGTH, PASSWORD_REGEX_PATTERN, FORM_MESSAGING } =
  constants

const auth = firebase.auth()

const FORM_IDS = {
  CURRENT_PASSWORD: 'current-password',
  NEW_PASSWORD: 'new-password',
  CONFIRM_NEW_PASSWORD: 'confirm-new-password',
}

interface PropTypes {
  userHasPassword: boolean
}

const ChangePasswordForm = ({ userHasPassword }: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<{ message: string } | null>(null)
  const authUser = useAuthUser()

  const { handleSubmit, control, setError, getValues } = useForm()

  const onSubmit = async (data: FieldValues) => {
    const currentPassword = data[FORM_IDS.CURRENT_PASSWORD]
    const newPassword = data[FORM_IDS.NEW_PASSWORD]
    const confirmNewPassword = data[FORM_IDS.CONFIRM_NEW_PASSWORD]
    const { email } = authUser

    setFormError(null)
    setIsLoading(true)

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      })
      await auth.signInWithEmailAndPassword(
        email as string,
        newPassword as string
      )
      setSubmitted(true)
      setIsLoading(false)
    } catch (error: any) {
      if (
        error.code === 'invalid-argument' &&
        error.message === '`currentPassword` is incorrect.'
      ) {
        setError(FORM_IDS.CURRENT_PASSWORD, {
          message: 'The current password you entered is incorrect.'
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
      <Typography variant="body2">
        Your password has been changed.
      </Typography>
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
                  label="Current password"
                  type="password"
                  variant="outlined"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Link href="/forgot-password" passHref>
              <MuiLink variant="caption">Forgot password?</MuiLink>
            </Link>
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
              message: FORM_MESSAGING.MIN_LENGTH,
            },
            pattern: {
              value: PASSWORD_REGEX_PATTERN,
              message: FORM_MESSAGING.PATTERN,
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
            }}
          >
            {formError && (
              <Typography
                variant="caption"
                color="error"
                component="div"
                mb={1}
              >
                {formError.message}
              </Typography>
            )}
            <LoadingButton
              loading={isLoading}
              type="submit"
              variant="contained"
            >
              Submit
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ChangePasswordForm
