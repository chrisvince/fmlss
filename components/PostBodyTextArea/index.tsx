import {
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertFromHTML,
  ContentState,
  convertFromRaw,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import { Avatar, Typography, useTheme } from '@mui/material'

import constants from '../../constants'
import { Box } from '@mui/system'

const { HASHTAG_REGEX } = constants

type DraftStrategyCallback = (start: number, end: number) => void

const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: 'key',
      text: '',
      type: 'unstyled',
    },
  ],
})

const createRegexStrategy = (regex: RegExp) => (
  contentBlock: Draft.ContentBlock,
  callback: DraftStrategyCallback,
) => {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

const createRegexDecorator = (
  regex: RegExp,
  component: Draft.DraftDecorator['component']
) => ({
  strategy: createRegexStrategy(regex),
  component,
})

const Hashtag = ({ children }: { children: string }) => (
  <Typography
    color="secondary"
    component="span"
  >
    {children}
  </Typography>
)

const compositeDecorator = new CompositeDecorator([
  createRegexDecorator(HASHTAG_REGEX, Hashtag),
])

type Props = {
  disabled?: boolean
  focusOnMount?: boolean
  onChange?: (text: string) => void
  onCommandEnter?: () => void
  placeholder?: string
  username: string
}

export interface PostBodyTextAreaRef {
  clear?: () => void
  getValue?: () => string
  replaceText?: (text: string) => void
}

const PostBodyTextArea = (
  {
    disabled,
    focusOnMount,
    onChange,
    onCommandEnter,
    placeholder,
    username,
  }: Props,
  ref: React.Ref<PostBodyTextAreaRef>
) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(emptyContentState, compositeDecorator)
  )

  const editorRef = useRef<Editor>()
  const { palette } = useTheme()

  const replaceText = useCallback((text: string) => {
    const content = convertFromHTML(text)

    const contentState = ContentState.createFromBlockArray(
      content.contentBlocks,
      content.entityMap
    )

    const editorState = EditorState.createWithContent(
      contentState,
      compositeDecorator
    )

    const selectionEditorState = EditorState.moveSelectionToEnd(editorState)

    const newState = EditorState.forceSelection(
      editorState,
      selectionEditorState.getSelection()
    )

    setEditorState(newState)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      clear: () => replaceText(''),
      getValue: () => editorState.getCurrentContent().getPlainText(),
      replaceText,
    }),
    [editorState, replaceText]
  )

  useEffect(() => {
    if (!focusOnMount) return
    editorRef.current?.focus()
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

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'min-content 1fr',
        alignItems: 'baseline',
        gap: 2,
        py: 2,
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
            editorKey="editor"
            editorState={editorState}
            onChange={onEditorStateChange}
            readOnly={disabled}
            placeholder={placeholder}
            handleReturn={handleReturn}
          />
        </Typography>
      </Box>
    </Box>
  )
}

export default forwardRef(PostBodyTextArea)
