import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import {
  Editor,
  EditorState,
  convertFromRaw,
  CompositeDecorator,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import classnames from 'classnames'
import styles from './index.module.scss'
import constants from '../../constants'

const { HASHTAG_REGEX } = constants

const initialEditorState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: '',
      key: 'foo',
      type: 'unstyled',
      entityRanges: [],
      depth: 0,
      inlineStyleRanges: [],
    },
  ],
})

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
  <span style={{ color: 'dodgerblue' }}>{children}</span>
)

const compositeDecorator = new CompositeDecorator([
  createRegexDecorator(HASHTAG_REGEX, Hashtag),
])

type PropTypes = {
  disabled?: boolean
  onChange?: (text: string) => void
}

const PostBodyTextArea = (
  { disabled, onChange }: PropTypes,
  ref: React.Ref<{ clear: () => void }>
) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(initialEditorState, compositeDecorator)
  )

  useEffect(() => {
    onChange?.(editorState.getCurrentContent().getPlainText())
  }, [editorState, onChange])

  const clear = () => {
    const cleanState = EditorState.createWithContent(
      initialEditorState,
      compositeDecorator
    )
    setEditorState(cleanState)
  }

  useImperativeHandle(ref, () => ({ clear }))

  const onEditorStateChange = (editorState: EditorState) => setEditorState(editorState)

  const wrapperClassName = classnames(styles.wrapper, {
    [styles.disabled]: disabled,
  })

  return (
    <div className={wrapperClassName}>
      <Editor
        editorKey="editor"
        editorState={editorState}
        onChange={onEditorStateChange}
        readOnly={disabled}
      />
    </div>
  )
}

export default forwardRef(PostBodyTextArea)
