import {
  KeyboardEvent,
  LegacyRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import createHashtagPlugin, { HashtagProps } from '@draft-js-plugins/hashtag'
import { convertFromRaw, EditorState } from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import 'draft-js/dist/Draft.css'
import { Typography } from '@mui/material'
import createLinkifyPlugin, { extractLinks } from '@draft-js-plugins/linkify'
import { Box } from '@mui/system'
import { ComponentProps } from '@draft-js-plugins/linkify/lib/Link/Link'
import { Match } from 'linkify-it'

import constants from '../../constants'
import { PostAttachmentType } from '../../types'
import numeral from 'numeral'
import PostBodyAttachments from '../PostBodyAttachments'
import usePostBodyTextAreaPlaceholder, {
  PostType,
} from '../../utils/usePostBodyTextAreaPlaceholder'
import { NotesRounded } from '@mui/icons-material'
import PluginEditor from '@draft-js-plugins/editor/lib/Editor'
import { pipe } from 'ramda'
import { resolvePostAttachmentTypeFromUrl } from '../../utils/socialPlatformUrls'
import debounce from 'lodash.debounce'

const { POST_MAX_LENGTH } = constants

const POST_WARNING_LENGTH = POST_MAX_LENGTH - 80
const MAX_POST_ATTACHMENTS = 2

const formatPostLength = (length: number | undefined) =>
  numeral(length ?? 0).format('0,0')

export enum PostLengthStatusType {
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

const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: '',
      text: '',
      type: 'unstyled',
    },
  ],
})

export enum PostBodyTextAreaSize {
  Small = 'small',
  Large = 'large',
}

type Props = {
  disabled?: boolean
  focusOnMount?: boolean
  onChange?: (text: string) => void
  onCommandEnter?: () => void
  onLengthStatusChange?: (status: PostLengthStatusType) => void
  onTrackedMatchesChange?: (trackedMatches: TrackedMatch[]) => void
  postType?: PostType
  size?: PostBodyTextAreaSize
}

export interface TrackedMatch {
  closed: boolean
  error: Error | null
  match: Match
  type: PostAttachmentType
  url: string
}

const PostBodyTextArea = ({
  disabled,
  focusOnMount,
  onChange,
  onCommandEnter,
  onLengthStatusChange,
  onTrackedMatchesChange,
  postType = PostType.New,
  size = PostBodyTextAreaSize.Small,
}: Props) => {
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createWithContent(emptyContentState)
  )

  const [postLengthStatus, setPostLengthStatus] =
    useState<PostLengthStatusType>(PostLengthStatusType.none)

  const editorRef = useRef<Editor>()

  useEffect(() => {
    if (!focusOnMount) return

    setTimeout(() => {
      if (!editorRef.current) return
      editorRef.current.focus()
    }, 0)
  }, [focusOnMount])

  const updatePostLengthStatus = useCallback((text: string) => {
    if (text.length > POST_MAX_LENGTH) {
      setPostLengthStatus(PostLengthStatusType.error)
      return
    }

    if (text.length >= POST_WARNING_LENGTH) {
      setPostLengthStatus(PostLengthStatusType.warning)
      return
    }

    setPostLengthStatus(PostLengthStatusType.none)
  }, [])

  const removeDuplicateMatches = (links: Match[] | null) =>
    links?.reduce((acc, link) => {
      const existingLink = acc.some(({ url }) => url === link.url)
      return existingLink ? acc : [...acc, link]
    }, [] as Match[]) ?? []

  const convertMatchToTrackedMatch = (match: Match): TrackedMatch => ({
    closed: false,
    error: null,
    match,
    type: resolvePostAttachmentTypeFromUrl(match.url),
    url: match.url,
  })

  const [trackedMatches, setTrackedMatches] = useState<TrackedMatch[]>([])

  const mergeTrackedMatches = useCallback(
    (newTrackedMatches: TrackedMatch[]) =>
      newTrackedMatches.map(newTrackedMatch => {
        const existingTrackedMatch = trackedMatches.find(
          ({ url }) => url === newTrackedMatch.url
        )

        if (!existingTrackedMatch) {
          return newTrackedMatch
        }

        return {
          ...newTrackedMatch,
          closed: existingTrackedMatch.closed,
          error: existingTrackedMatch.error,
        }
      }),
    [trackedMatches]
  )

  const filterTrackedMatches = useCallback(
    (test: TrackedMatch[]) =>
      test
        .filter(({ closed, error }) => !closed && !error)
        .slice(0, MAX_POST_ATTACHMENTS),
    []
  )

  const updateTrackedMatchesFromText = useMemo(
    () =>
      debounce(
        (text: string) =>
          pipe(
            extractLinks,
            removeDuplicateMatches,
            links => links.map(convertMatchToTrackedMatch),
            mergeTrackedMatches,
            filterTrackedMatches,
            setTrackedMatches
          )(text),
        600
      ),
    [filterTrackedMatches, mergeTrackedMatches]
  )

  const handleEditorStateChange = (editorState: EditorState) => {
    const text = editorState.getCurrentContent().getPlainText()
    setEditorState(editorState)
    onChange?.(text)
    updateTrackedMatchesFromText(text)
    updatePostLengthStatus(text)
  }

  const handleReturn = (event: KeyboardEvent) => {
    if (!event.metaKey && !event.ctrlKey) {
      return 'not-handled'
    }

    onCommandEnter?.()
    return 'handled'
  }

  useEffect(() => {
    onLengthStatusChange?.(postLengthStatus)
  }, [onLengthStatusChange, postLengthStatus])

  const handleAttachmentClose = useCallback((url: string) => {
    setTrackedMatches(currentTrackedMatches =>
      currentTrackedMatches.map(currentTrackedMatch => {
        if (currentTrackedMatch.url !== url) {
          return currentTrackedMatch
        }

        return {
          ...currentTrackedMatch,
          closed: true,
        }
      })
    )
  }, [])

  const handleAttachmentError = useCallback((url: string, error: Error) => {
    setTrackedMatches(currentTrackedMatches =>
      currentTrackedMatches.map(currentTrackedMatch => {
        if (currentTrackedMatch.url !== url) {
          return currentTrackedMatch
        }

        return {
          ...currentTrackedMatch,
          error,
        }
      })
    )
  }, [])

  const value = editorState.getCurrentContent().getPlainText()
  const placeholder = usePostBodyTextAreaPlaceholder({ postType })
  const shouldRenderPostLength = value?.length > POST_WARNING_LENGTH
  const large = size === PostBodyTextAreaSize.Large

  useEffect(() => {
    onTrackedMatchesChange?.(trackedMatches)
  }, [trackedMatches, onTrackedMatchesChange])

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
              plugins={[linkifyPlugin, hashtagPlugin]}
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
                    postLengthStatus === PostLengthStatusType.warning ||
                    postLengthStatus === PostLengthStatusType.error
                      ? 'bold'
                      : undefined,
                  color:
                    postLengthStatus === PostLengthStatusType.error
                      ? 'error.main'
                      : postLengthStatus === PostLengthStatusType.warning
                      ? 'warning.main'
                      : undefined,
                }}
              >
                {formatPostLength(value?.length ?? 0)}/
                {formatPostLength(POST_MAX_LENGTH)}
              </Typography>
            </Box>
          )}
          <PostBodyAttachments
            onClose={handleAttachmentClose}
            onError={handleAttachmentError}
            trackedMatches={trackedMatches}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default PostBodyTextArea
