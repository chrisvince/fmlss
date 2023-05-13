import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { TextField } from '@mui/material'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'

import constants from '../../constants'
import { checkUsernameAvailability } from '../../utils/callableFirebaseFunctions'
import { updateUsername } from '../../utils/callableFirebaseFunctions/updateUsername'

const {
  FORM_MESSAGING,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX_PATTERN,
} = constants

const USERNAME_ID = 'username'

const GENERIC_ERROR_MESSAGE =
  'There was an error creating your username. Please try again later.'

const SignUpForm = () => {
  const { push: navigate } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false)
  const { control, handleSubmit, setError, watch, clearErrors } = useForm({
    mode: 'onChange',
  })
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(false)

  const onSubmit = async (data: FieldValues) => {
    const username = data[USERNAME_ID] as string

    setIsLoading(true)
    try {
      await updateUsername({ username })
      navigate('/feed')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      setUsernameAvailable(false)

      if (
        value.length < USERNAME_MIN_LENGTH ||
        value.length > USERNAME_MAX_LENGTH
      ) {
        checkUsernameAvailable.cancel()
        setLoadingAvailability(false)
        clearErrors(USERNAME_ID)
        return
      }

      const validUsername = new RegExp(USERNAME_REGEX_PATTERN).test(value)

      if (!validUsername) {
        checkUsernameAvailable.cancel()
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
          maxLength: {
            value: USERNAME_MAX_LENGTH,
            message: FORM_MESSAGING.USERNAME.MAX_LENGTH,
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
          fullWidth
          loading={isLoading}
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
