import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import constants from '../../constants'

import debounce from 'lodash.debounce'
import { extractLinks } from '@draft-js-plugins/linkify'
import mapLinkifyItMatchToPostAttachment from '../../utils/mapLinkifyItMatchToPostAttachment'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'
import useAttachment from '../../utils/data/useAttachment'
import PostAttachment from '../PostAttachment'

const { URL_REGEX_PATTERN } = constants

const URL_NAME = 'url'

interface Props {
  onCancel: () => void
  onClose?: () => void
  onConfirm: (postAttachmentInput: PostAttachmentInput) => void
  open: boolean
}

const UrlDialog = ({ onCancel, onClose, onConfirm, open }: Props) => {
  const [postAttachmentInput, setPostAttachmentInput] =
    useState<PostAttachmentInput | null>(null)

  const { control, handleSubmit, setError, setFocus, reset } = useForm()
  const { data: attachment } = useAttachment(postAttachmentInput?.url)

  const onSubmit = useCallback(async () => {
    if (!postAttachmentInput) {
      setError(URL_NAME, {
        message: 'Please enter a valid URL.',
      })
      return
    }

    onConfirm(postAttachmentInput)
  }, [onConfirm, postAttachmentInput, setError])

  const debouncedSetUrl = useMemo(
    () =>
      debounce(async (url: string) => {
        const links = extractLinks(url)

        if (!links) {
          setPostAttachmentInput(null)
          return
        }

        setPostAttachmentInput(mapLinkifyItMatchToPostAttachment(links[0]))
      }, 500),
    []
  )

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setPostAttachmentInput(null)
        reset()
      }, 200)

      return () => {
        clearTimeout(timeout)
      }
    }

    const timeout = setTimeout(() => {
      setFocus(URL_NAME)
    }, 100)

    return () => {
      clearTimeout(timeout)
    }
  }, [setFocus, open, reset])

  const handleFieldKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
    if (event.code !== 'Enter') {
      return
    }

    event.preventDefault()
    onSubmit()
  }

  return (
    <Dialog
      aria-labelledby="url-dialog-title"
      fullWidth
      maxWidth="xs"
      onClose={onClose ?? onCancel}
      open={open}
    >
      <DialogTitle id="url-dialog-title">Add URL</DialogTitle>
      <DialogContent>
        <Controller
          name={URL_NAME}
          control={control}
          defaultValue=""
          rules={{
            required: true,
            pattern: {
              value: URL_REGEX_PATTERN,
              message: 'Please enter a valid URL.',
            },
          }}
          render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
            <TextField
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              inputRef={ref}
              onBlur={onBlur}
              onChange={event => {
                debouncedSetUrl(event.target.value)
                onChange(event)
              }}
              onKeyDown={handleFieldKeyDown}
              type="url"
              variant="outlined"
              value={value}
            />
          )}
        />

        {attachment && (
          <Box sx={{ mt: 2 }}>
            <PostAttachment attachment={attachment} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel} sx={{ px: 2 }}>
          Cancel
        </Button>
        <Button
          autoFocus
          disabled={!postAttachmentInput}
          onClick={handleSubmit(onSubmit)}
          sx={{ px: 2 }}
          type="submit"
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UrlDialog
