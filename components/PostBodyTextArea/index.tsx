import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator,
  convertFromHTML,
  ContentState,
  SelectionState,
} from 'draft-js'
import 'draft-js/dist/Draft.css' // check if needed
import { Typography, useTheme } from '@mui/material'

import constants from '../../constants'

const { HASHTAG_REGEX } = constants

// const initialEditorState = convertFromRaw({
//   entityMap: {},
//   blocks: [
//     {
//       text: '',
//       key: '',
//       type: 'unstyled',
//       entityRanges: [],
//       depth: 0,
//       inlineStyleRanges: [],
//     },
//   ],
// })

type DraftStrategyCallback = (start: number, end: number) => void

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
  value?: string
}

const PostBodyTextArea = (
  {
    disabled,
    focusOnMount,
    onChange,
    value = '',
  }: Props,
) => {
  const [editorState, setEditorState] = useState(() => {
    const blocksFromHTML = convertFromHTML(value)
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    )
    const editorState = EditorState.createWithContent(
      contentState,
      compositeDecorator
    )
    return editorState
  })
  const editorRef = useRef<Editor>()
  const { palette } = useTheme()

  useEffect(() => {
    const blocksFromHTML = convertFromHTML(value)

    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    )

    const editorState = EditorState.createWithContent(
      contentState,
      compositeDecorator
    )

    setEditorState(editorState)
  }, [value])

  const currentText = editorState.getCurrentContent().getPlainText()
  useEffect(() => {
    onChange?.(currentText)
  }, [currentText, onChange])

  useEffect(() => {
    if (!focusOnMount) return
    editorRef.current?.focus()
  }, [focusOnMount])

  // const clear = () => {
  //   const content = convertFromHTML('')
  //   const contentState = ContentState.createFromBlockArray(
  //     content.contentBlocks,
  //     content.entityMap
  //   )
  //   const cleanState = EditorState.createWithContent(
  //     contentState,
  //     compositeDecorator
  //   )
  //   setEditorState(cleanState)
  // }

  // useImperativeHandle(ref, () => ({ clear }))

  const onEditorStateChange = (editorState: EditorState) =>
    setEditorState(editorState)

  return (
    <Typography
      component="div"
      variant="body1"
      sx={{ opacity: disabled ? palette.action.disabledOpacity : 1 }}
    >
      <Editor
        // @ts-ignore
        ref={editorRef}
        preserveSelectionOnBlur={true}
        editorKey="editor"
        editorState={editorState}
        onChange={onEditorStateChange}
        readOnly={disabled}
        placeholder="Write a reply"
      />
    </Typography>
  )
}

export default PostBodyTextArea
