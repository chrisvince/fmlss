import { useState } from 'react'
import 'firebase/auth'
import { Box } from '@mui/system'
import { TextField, Typography } from '@mui/material'
import { Controller, FieldValues, useForm } from 'react-hook-form'

import { updateName } from '../../utils/callableFirebaseFunctions/updateName'
import constants from '../../constants'
import { LoadingButton } from '@mui/lab'
import useUser from '../../utils/data/user/useUser'
import PageSpinner from '../PageSpinner'

const { FIRST_NAME_MAX_LENGTH, FORM_MESSAGING, LAST_NAME_MAX_LENGTH } =
  constants

const FORM_IDS = {
  FIRST_NAME: 'first-name',
  LAST_NAME: 'last-name',
}

const ChangeNameForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [formError, setFormError] = useState<{ message: string } | null>(null)
  const { control, handleSubmit } = useForm()
  const { isLoading: userIsLoading, user } = useUser()

  if (userIsLoading) {
    return <PageSpinner />
  }

  const onSubmit = async (data: FieldValues) => {
    const firstName = data[FORM_IDS.FIRST_NAME] as string
    const lastName = data[FORM_IDS.LAST_NAME] as string

    setFormError(null)
    setIsLoading(true)

    try {
      await updateName({ firstName, lastName })
      setSubmitted(true)
      setIsLoading(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFormError({
        message: 'There was an issue updating your name. Please try again.',
      })
      setIsLoading(false)
    }
  }

  if (submitted) {
    return <Typography variant="body2">Your name has been updated.</Typography>
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
          Update your name by entering it below.
        </Typography>
        <Controller
          name={FORM_IDS.FIRST_NAME}
          control={control}
          defaultValue={user?.data.firstName}
          rules={{
            maxLength: FIRST_NAME_MAX_LENGTH,
            required: FORM_MESSAGING.REQUIRED,
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              {...field}
              disabled={isLoading}
              label="First name"
              type="text"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name={FORM_IDS.LAST_NAME}
          control={control}
          defaultValue={user?.data.lastName}
          rules={{
            maxLength: LAST_NAME_MAX_LENGTH,
            required: FORM_MESSAGING.REQUIRED,
          }}
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              {...field}
              disabled={isLoading}
              label="Last name"
              type="text"
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

export default ChangeNameForm
