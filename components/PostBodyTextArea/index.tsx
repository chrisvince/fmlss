import { KeyboardEvent, LegacyRef, useEffect, useMemo, useRef } from 'react'
import { EditorState } from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import 'draft-js/dist/Draft.css'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import constants from '../../constants'
import numeral from 'numeral'
import PostBodyAttachments from '../PostBodyAttachments'
import usePostBodyTextAreaPlaceholder, {
  PostType,
} from '../../utils/usePostBodyTextAreaPlaceholder'
import { NotesRounded } from '@mui/icons-material'
import PluginEditor from '@draft-js-plugins/editor/lib/Editor'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'
import createHashtagPlugin from '../../utils/draft-js/plugins/hashtag'
import createLinkifyPlugin from '../../utils/draft-js/plugins/linkify'

const { POST_MAX_LENGTH } = constants

const POST_WARNING_LENGTH = POST_MAX_LENGTH - 80

const PLUGINS = [
  createLinkifyPlugin(),
  createHashtagPlugin({ readOnly: false }),
]

const formatPostLength = (length: number | undefined) =>
  numeral(length ?? 0).format('0,0')

export enum PostLengthStatusType {
  Warning = 'warning',
  Error = 'error',
  None = 'none',
}

export enum PostBodyTextAreaSize {
  Small = 'small',
  Large = 'large',
}

type Props = {
  disabled?: boolean
  editorState: EditorState
  focusOnMount?: boolean
  postAttachments?: PostAttachmentInput[]
  onChange?: (text: EditorState) => void
  onCommandEnter?: () => void
  onPostAttachmentClose?: (url: string) => void
  postType?: PostType
  size?: PostBodyTextAreaSize
}

const PostBodyTextArea = ({
  disabled,
  editorState,
  focusOnMount,
  onChange,
  onCommandEnter,
  onPostAttachmentClose,
  postAttachments = [],
  postType = PostType.New,
  size = PostBodyTextAreaSize.Small,
}: Props) => {
  const editorRef = useRef<Editor>()
  const focusOnMountHasRun = useRef(false)

  useEffect(() => {
    if (!focusOnMount || focusOnMountHasRun.current) return

    setTimeout(() => {
      if (!editorRef.current) return
      editorRef.current.focus()
      focusOnMountHasRun.current = true
    }, 0)
  }, [focusOnMount])

  const handleEditorStateChange = (newEditorState: EditorState) => {
    onChange?.(newEditorState)
  }

  const handleReturn = (event: KeyboardEvent) => {
    if (!event.metaKey && !event.ctrlKey) {
      return 'not-handled'
    }

    onCommandEnter?.()
    return 'handled'
  }

  const plainText = editorState?.getCurrentContent().getPlainText()
  const placeholder = usePostBodyTextAreaPlaceholder({ postType })
  const shouldRenderPostLength = (plainText?.length ?? 0) > POST_WARNING_LENGTH
  const large = size === PostBodyTextAreaSize.Large

  const postLengthStatus = useMemo(() => {
    if (plainText.length > POST_MAX_LENGTH) {
      return PostLengthStatusType.Error
    }

    if (plainText.length >= POST_WARNING_LENGTH) {
      return PostLengthStatusType.Warning
    }

    return PostLengthStatusType.None
  }, [plainText.length])

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'min-content 1fr',
          alignItems: 'start',
          gap: 2,
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: '40px',
            justifyContent: 'center',
          }}
        >
          <NotesRounded color="action" />
        </Box>
        <Box
          sx={{
            borderBottomColor: large ? 'action.disabled' : undefined,
            borderBottomStyle: large ? 'solid' : undefined,
            borderBottomWidth: large ? '1px' : undefined,
            pb: 3,
            pt: 1,
          }}
        >
          <Typography
            component="div"
            variant="body1"
            sx={{
              opacity: disabled ? 'action.disabledOpacity' : 1,
              '.public-DraftEditorPlaceholder-root, .public-DraftEditorPlaceholder-hasFocus':
                {
                  color: 'text.disabled',
                },
              ...(large
                ? {
                    '.public-DraftEditor-content': {
                      minHeight: '80px',
                    },
                  }
                : {}),
            }}
          >
            <Editor
              editorState={editorState}
              handleReturn={handleReturn}
              onChange={handleEditorStateChange}
              placeholder={placeholder}
              plugins={PLUGINS}
              preserveSelectionOnBlur
              readOnly={disabled}
              ref={editorRef as LegacyRef<PluginEditor>}
              stripPastedStyles
            />
          </Typography>
          {shouldRenderPostLength && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                pt: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight:
                    postLengthStatus === PostLengthStatusType.Warning ||
                    postLengthStatus === PostLengthStatusType.Error
                      ? 'bold'
                      : undefined,
                  color:
                    postLengthStatus === PostLengthStatusType.Error
                      ? 'error.main'
                      : postLengthStatus === PostLengthStatusType.Warning
                      ? 'warning.main'
                      : undefined,
                }}
              >
                {formatPostLength(plainText?.length ?? 0)}/
                {formatPostLength(POST_MAX_LENGTH)}
              </Typography>
            </Box>
          )}
          <PostBodyAttachments
            onClose={onPostAttachmentClose}
            onError={onPostAttachmentClose}
            postAttachments={postAttachments}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default PostBodyTextArea
