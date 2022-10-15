import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { Box } from '@mui/system'
import { TextField, Typography } from '@mui/material'
import { Controller, FieldValues, useForm } from 'react-hook-form'

import constants from '../../constants'
import { LoadingButton } from '@mui/lab'
import debounce from 'lodash.debounce'
import { useAuthUser } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { checkUsernameAvailability } from '../../utils/callableFirebaseFunctions'
import { updateUsername } from '../../utils/callableFirebaseFunctions/updateUsername'

const {
  FORM_MESSAGING,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX_PATTERN,
} = constants

const USERNAME_ID = 'username'

const GENERIC_ERROR_MESSAGE =
  'There was an error signing you up. Please try again later.'

const SignUpForm = () => {
  const { id: uid } = useAuthUser()
  const { push: navigate } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formCanBeSubmitted, setFormCanBeSubmitted] = useState<boolean>(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false)
  const { control, handleSubmit, setError, watch, clearErrors } = useForm()
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(false)

  const onSubmit = async (data: FieldValues) => {
    const username = data[USERNAME_ID] as string

    setIsLoading(true)
    try {
      await updateUsername({ username })
      navigate('/feed')
    } catch (error: any) {
      setIsLoading(false)

      if (error.code === 'already-exists') {
        setError(USERNAME_ID, {
          message: FORM_MESSAGING.USERNAME.TAKEN,
        })
        return
      }

      setError(USERNAME_ID, {
        message: GENERIC_ERROR_MESSAGE,
      })
    }
  }

  useEffect(() => {
    const checkUsernameAvailable = debounce(async (username: string) => {
      const {
        data: { usernameAvailable },
      } = await checkUsernameAvailability({ username })

      setFormCanBeSubmitted(usernameAvailable)

      if (usernameAvailable) {
        setUsernameAvailable(true)
        setLoadingAvailability(false)
        return
      }

      setError(USERNAME_ID, {
        message: FORM_MESSAGING.USERNAME.TAKEN,
      })
      setLoadingAvailability(false)
    }, 1000)

    const subscription = watch((values, { name }) => {
      if (name !== USERNAME_ID) return
      const value = values[USERNAME_ID] as string
      const validUsername = new RegExp(USERNAME_REGEX_PATTERN).test(value)
      setUsernameAvailable(false)

      if (!validUsername) {
        setLoadingAvailability(false)
        setError(USERNAME_ID, {
          message: FORM_MESSAGING.USERNAME.PATTERN,
        })
        return
      }

      setLoadingAvailability(true)
      clearErrors(USERNAME_ID)
      checkUsernameAvailable(value)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [clearErrors, setError, watch])

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
      <Controller
        name={USERNAME_ID}
        control={control}
        defaultValue=""
        rules={{
          required: FORM_MESSAGING.REQUIRED,
          pattern: {
            value: USERNAME_REGEX_PATTERN,
            message: FORM_MESSAGING.USERNAME.PATTERN,
          },
          minLength: {
            value: USERNAME_MIN_LENGTH,
            message: FORM_MESSAGING.USERNAME.MIN_LENGTH,
          },
        }}
        render={({ field, fieldState }) => (
          <TextField
            fullWidth
            {...field}
            autoComplete="off"
            spellCheck={false}
            color={usernameAvailable ? 'success' : undefined}
            disabled={isLoading}
            error={!!fieldState.error}
            sx={{
              '& .MuiFormHelperText-root': {
                color: usernameAvailable ? 'success.main' : undefined,
              },
            }}
            helperText={
              loadingAvailability
                ? 'Checking if username is available...'
                : usernameAvailable
                  ? 'Username is available'
                  : fieldState.error?.message
            }
            label="Username"
            type="text"
            variant="outlined"
          />
        )}
      />
      <Box>
        <LoadingButton
          disabled={!formCanBeSubmitted}
          fullWidth
          loading={isLoading || loadingAvailability}
          type="submit"
          variant="contained"
        >
          Continue
        </LoadingButton>
      </Box>
    </Box>
  )
}

export default SignUpForm
