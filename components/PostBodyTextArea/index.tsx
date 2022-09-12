import {
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import createHashtagPlugin, { HashtagProps } from '@draft-js-plugins/hashtag'
import { EditorState } from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import 'draft-js/dist/Draft.css'
import { Avatar, Typography, useTheme } from '@mui/material'
import createLinkifyPlugin, { extractLinks } from '@draft-js-plugins/linkify'
import { Box } from '@mui/system'
import { ComponentProps } from '@draft-js-plugins/linkify/lib/Link/Link'
import { update } from 'ramda'

import constants from '../../constants'
import { PostPreview as PostPreviewType } from '../../types'
import PostBodyTextAreaLinkPreview from '../PostBodyTextAreaLinkPreview'

const { POST_MAX_LENGTH } = constants

const POST_WARNING_LENGTH = POST_MAX_LENGTH - 20

export enum postLengthStatusType {
  warning = 'warning',
  error = 'error',
  none = 'none',
}

const Hashtag = ({ children }: HashtagProps) => (
  <Typography color="secondary" component="span">
    {children}
  </Typography>
)

const LinkifyLink = ({ children }: ComponentProps) => (
  <Typography color="secondary" component="span">
    {children}
  </Typography>
)

const hashtagPlugin = createHashtagPlugin({
  hashtagComponent: Hashtag,
})

const linkifyPlugin = createLinkifyPlugin({
  component: LinkifyLink,
})

export interface PostBodyTextAreaRef {
  linkPreviews: PostPreviewType[]
  value: string
}

type Props = {
  disabled?: boolean
  focusOnMount?: boolean
  onChange?: (text: string) => void
  onCommandEnter?: () => void
  onLengthStatusChange?: (status: postLengthStatusType) => void
  placeholder?: string
  username: string
}

const PostBodyTextArea = (
  {
    disabled,
    focusOnMount,
    onChange,
    onCommandEnter,
    onLengthStatusChange,
    placeholder,
    username,
  }: Props,
  ref: React.Ref<PostBodyTextAreaRef>
) => {
  const [editorState, setEditorState] = useState<EditorState>(
    () => EditorState.createEmpty()
  )
  const [postLengthStatus, setPostLengthStatus] =
    useState<postLengthStatusType>(postLengthStatusType.none)
  
  const [linkPreviews, setLinkPreviews] = useState<PostPreviewType[]>([])

  const editorRef = useRef<Editor>()
  const { palette } = useTheme()

  useEffect(() => {
    if (!focusOnMount) return

    setTimeout(() => {
      editorRef.current!.focus()
    }, 0)
  }, [focusOnMount])

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState)
    onChange?.(editorState.getCurrentContent().getPlainText())
  }

  const handleReturn = (event: KeyboardEvent) => {
    if (!event.metaKey && !event.ctrlKey) {
      return 'not-handled'
    }
    onCommandEnter?.()
    return 'handled'
  }

  const avatarLetter = username.charAt(0).toUpperCase()
  const value = editorState?.getCurrentContent().getPlainText()
  const links = extractLinks(value)

  useImperativeHandle(ref, () => ({
    linkPreviews,
    value,
  }), [linkPreviews, value])

  useEffect(() => {
    if (value.length > POST_MAX_LENGTH) {
      setPostLengthStatus(postLengthStatusType.error)
      onLengthStatusChange?.(postLengthStatusType.error)
      return
    }
    if (value.length >= POST_WARNING_LENGTH) {
      setPostLengthStatus(postLengthStatusType.warning)
      onLengthStatusChange?.(postLengthStatusType.warning)
      return
    }
    setPostLengthStatus(postLengthStatusType.none)
    onLengthStatusChange?.(postLengthStatusType.none)
  }, [onLengthStatusChange, value])

  const handleLinkPreviewChange = useCallback((newPostPreview: PostPreviewType) => {
    setLinkPreviews(currentPostPreviews => {
      const matchingPostPreviewIndex = currentPostPreviews.findIndex(
        postPreview => postPreview.href === newPostPreview.href
      )

      if (matchingPostPreviewIndex === -1) {
        return [...currentPostPreviews, newPostPreview]
      }

      return update(
        matchingPostPreviewIndex,
        newPostPreview,
        currentPostPreviews
      )
    })
  }, [])

  const handleLinkPreviewClose = useCallback(
    (closedPostPreview: PostPreviewType) => {
      setLinkPreviews(currentPostPreviews =>
        currentPostPreviews.filter(
          ({ href }) => href !== closedPostPreview.href
        )
      )
    },
    []
  )

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'min-content 1fr',
          alignItems: 'baseline',
          gap: 2,
          pt: 2,
        }}
      >
        <Box>
          <Avatar>{avatarLetter}</Avatar>
        </Box>
        <Box>
          <Typography
            component="div"
            variant="body1"
            sx={{
              opacity: disabled ? palette.action.disabledOpacity : 1,
              '.public-DraftEditorPlaceholder-root, .public-DraftEditorPlaceholder-hasFocus':
                {
                  color: palette.text.disabled,
                },
            }}
          >
            <Editor
              // @ts-ignore
              ref={editorRef}
              preserveSelectionOnBlur={true}
              editorState={editorState}
              onChange={onEditorStateChange}
              readOnly={disabled}
              placeholder={placeholder}
              handleReturn={handleReturn}
              plugins={[linkifyPlugin, hashtagPlugin]}
            />
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              visibility:
                value?.length > POST_WARNING_LENGTH ? 'visible' : 'hidden',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight:
                  postLengthStatus === postLengthStatusType.warning ||
                  postLengthStatus === postLengthStatusType.error
                    ? 'bold'
                    : undefined,
                color:
                  postLengthStatus === postLengthStatusType.error
                    ? 'error.main'
                    : postLengthStatus === postLengthStatusType.warning
                    ? 'warning.main'
                    : undefined,
              }}
            >
              {value?.length ?? 0}/{POST_MAX_LENGTH}
            </Typography>
          </Box>
        </Box>
      </Box>
      {links?.map(({ url }) => (
        <PostBodyTextAreaLinkPreview
          key={url}
          url={url}
          onChange={handleLinkPreviewChange}
          onClose={handleLinkPreviewClose}
        />
      ))}
    </Box>
  )
}

export default forwardRef(PostBodyTextArea)
