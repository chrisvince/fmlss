import { EditorState, convertFromRaw } from 'draft-js'

const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: 'foo',
      text: '',
      type: 'unstyled',
    },
  ],
})

const createEmptyEditorState = (): EditorState =>
  EditorState.createWithContent(emptyContentState)

export default createEmptyEditorState
