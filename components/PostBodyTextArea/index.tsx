import {
  KeyboardEvent,
  LegacyRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { EditorState } from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import 'draft-js/dist/Draft.css'
import { GlobalStyles, Typography } from '@mui/material'
import { Box } from '@mui/system'

import PostBodyAttachments from '../PostBodyAttachments'
import usePostBodyTextAreaPlaceholder, {
  PostType,
} from '../../utils/usePostBodyTextAreaPlaceholder'
import { NotesRounded } from '@mui/icons-material'
import PluginEditor from '@draft-js-plugins/editor/lib/Editor'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'
import createHashtagPlugin from '../../utils/draft-js/plugins/hashtag'
import createLinkifyPlugin from '../../utils/draft-js/plugins/linkify'
import '@draft-js-plugins/mention/lib/plugin.css'
import { MentionData } from '@draft-js-plugins/mention'
import createMentionPlugin, {
  mentionStyles,
} from '../../utils/draft-js/plugins/mention'
import getPeopleSearch from '../../utils/data/people/getPeopleSearch'
import debounce from 'lodash.debounce'
import slugify from '../../utils/slugify'
import PostBodyCounter from '../PostBodyCounter'
import PostBodyActionBar from '../PostBodyActionBar'
import constants from '../../constants'

const { POST_ATTACHMENTS_MAX_COUNT } = constants

const mentionPlugin = createMentionPlugin({ readOnly: false })

const PLUGINS = [
  mentionPlugin,
  createLinkifyPlugin({ readOnly: false }),
  createHashtagPlugin({ readOnly: false }),
]

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
  displayBorderBottom?: boolean
  editorState: EditorState
  focusOnMount?: boolean
  isInlineReply?: boolean
  onChange?: (text: EditorState) => void
  onCommandEnter?: () => void
  onFocus?: () => void
  onPostAttachmentClose?: (url: string) => void
  onUrlAdd: (postAttachmentInput: PostAttachmentInput) => void
  postAttachments?: PostAttachmentInput[]
  postType?: PostType
  size?: PostBodyTextAreaSize
  textLength: number
}

const PostBodyTextArea = ({
  disabled,
  displayBorderBottom = true,
  editorState,
  focusOnMount,
  isInlineReply,
  onChange,
  onCommandEnter,
  onFocus,
  onPostAttachmentClose,
  onUrlAdd,
  postAttachments = [],
  postType = PostType.New,
  size = PostBodyTextAreaSize.Small,
  textLength,
}: Props) => {
  const editorRef = useRef<Editor>()
  const focusOnMountHasRun = useRef(false)
  const [mentionSuggestionsOpen, setMentionSuggestionsOpen] = useState(false)
  const [displayTagInstruction, setDisplayTagInstruction] = useState(false)

  const [mentionSuggestions, setMentionSuggestions] = useState<MentionData[]>(
    []
  )

  const { MentionSuggestions } = mentionPlugin

  const getMentionSuggestions = useMemo(
    () =>
      debounce(async (searchValue: string) => {
        const searchValueSlug = slugify(searchValue)
        const results = await getPeopleSearch(searchValue)

        const resultMentions = results.map(({ data }) => ({
          link: `/people/${data.slug}`,
          name: data.name,
        }))

        const matchExists = results.some(
          person => person.data.slug === searchValueSlug
        )

        const mentions = [
          ...(matchExists
            ? []
            : [{ name: searchValue, link: `/people/${searchValueSlug}` }]),
          ...resultMentions,
        ]

        setMentionSuggestionsOpen(true)
        setMentionSuggestions(mentions)
      }, 500),
    []
  )

  const onSearchChange = useCallback(
    async ({ value }: { value: string }) => {
      if (!value) {
        setMentionSuggestions([])
        setMentionSuggestionsOpen(false)
        return
      }

      const searchValueSlug = slugify(value)

      setMentionSuggestions([
        { name: value, link: `/people/${searchValueSlug}` },
      ])

      getMentionSuggestions(value)
    },
    [getMentionSuggestions]
  )

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
  const large = size === PostBodyTextAreaSize.Large

  useEffect(() => {
    setDisplayTagInstruction(currentDisplayTagInstruction => {
      if (currentDisplayTagInstruction) return true
      return !!plainText
    })
  }, [plainText])

  const handleEditorBlur = () => {
    setDisplayTagInstruction(false)
  }

  const shouldShowActionBar = !isInlineReply

  return (
    <>
      <GlobalStyles styles={mentionStyles} />
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
              borderBottomColor: displayBorderBottom
                ? 'action.disabled'
                : undefined,
              borderBottomStyle: displayBorderBottom ? 'solid' : undefined,
              borderBottomWidth: displayBorderBottom ? '1px' : undefined,
              pt: 1,
              pb: isInlineReply ? 3 : 1,
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
                onBlur={handleEditorBlur}
                onChange={handleEditorStateChange}
                onFocus={onFocus}
                placeholder={placeholder}
                plugins={PLUGINS}
                preserveSelectionOnBlur
                readOnly={disabled}
                ref={editorRef as LegacyRef<PluginEditor>}
                stripPastedStyles
              />
            </Typography>
            <MentionSuggestions
              onOpenChange={setMentionSuggestionsOpen}
              onSearchChange={onSearchChange}
              open={mentionSuggestionsOpen}
              suggestions={mentionSuggestions}
            />
            {!isInlineReply && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  pt: 1,
                }}
              >
                <Box
                  sx={{
                    opacity: displayTagInstruction ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                  }}
                >
                  <Typography variant="caption" color="action.active">
                    Use # for hashtags and @ to tag people.
                  </Typography>
                </Box>
                <Box>
                  <PostBodyCounter textLength={textLength} />
                </Box>
              </Box>
            )}
            {shouldShowActionBar && (
              <PostBodyActionBar
                disableUrlButton={
                  postAttachments.length >= POST_ATTACHMENTS_MAX_COUNT
                }
                onUrlAdd={onUrlAdd}
              />
            )}
            <PostBodyAttachments
              onClose={onPostAttachmentClose}
              onError={onPostAttachmentClose}
              postAttachments={postAttachments}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default PostBodyTextArea
