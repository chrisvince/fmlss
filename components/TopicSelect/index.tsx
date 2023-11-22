import { Chip, Typography } from '@mui/material'
import {
  Fragment,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import debounce from 'lodash.debounce'

import useTopicsStartsWith from '../../utils/data/topics/useTopicsStartsWith'
import constants from '../../constants'
import { DraftHandleValue, Editor, EditorState, convertFromRaw } from 'draft-js'
import { Box } from '@mui/system'
import { AlternateEmailRounded } from '@mui/icons-material'
import slugify from '../../utils/slugify'
import { dropLast, last, remove, splitAt } from 'ramda'

const { TOPIC_MAX_LENGTH, TOPIC_MAX_SUBTOPICS, TOPIC_MIN_LENGTH } = constants

const createStateFromText = (text = '') =>
  convertFromRaw({
    entityMap: {},
    blocks: [
      {
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: 'block',
        text,
        type: 'unstyled',
      },
    ],
  })

const insertText = (
  pastedText: string,
  existingText: string,
  {
    start,
    end,
  }: {
    start?: number
    end?: number
  } = {}
): string => {
  if (!start) {
    return existingText + pastedText
  }

  if (start === end || !end) {
    const [before, after] = splitAt(start, existingText)
    return before + pastedText + after
  }

  const before = splitAt(start, existingText)[0]
  const after = splitAt(end, existingText)[1]
  return before + pastedText + after
}

export interface Topic {
  path: string
  pathTitle: string
  pathTitleSegments: string[]
  slug: string
  slugSegments: string[]
  title: string
}

const isMaximumSubtopics = (subtopics: string[]) =>
  subtopics.length >= TOPIC_MAX_SUBTOPICS - 1

const createTopicPath = (subtopics: string[]) =>
  subtopics.map(slugify).join('/')

interface Props {
  onChange?: (subtopic: string[]) => void
}

const TopicSelect = ({ onChange }: Props) => {
  const { topics, search, clear } = useTopicsStartsWith()
  console.log('topics', topics)

  const debouncedSearch = useMemo(
    () => debounce((searchString: string) => search(searchString), 1000),
    [search]
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createWithContent(createStateFromText())
  )

  const [displaySubTopicInstruction, setDisplaySubTopicInstruction] =
    useState(false)

  const [subtopics, setSubtopics] = useState<string[]>([])

  const onEditorStateChange = useCallback(
    (editorState: EditorState) => {
      const text = editorState.getCurrentContent().getPlainText()
      setEditorState(editorState)
      onChange?.(plainText)

      if (text) {
        setDisplaySubTopicInstruction(true)
      }

      if (subtopics.length === 0 && text.length < 2) {
        clear()
        return
      }

      if (!lastSubtopic) {
        return
      }

      debouncedSearch(createTopicPath(filteredSubtopics))
    },
    [clearSearch, debouncedSearch, onChange, subtopics]
  )

  const handleKeyCommand = useCallback(
    (command: string, editorState: EditorState): DraftHandleValue => {
      const text = editorState.getCurrentContent().getPlainText()
      const currentSelection = editorState.getSelection()
      const anchorOffset = currentSelection.getAnchorOffset()
      const focusOffset = currentSelection.getFocusOffset()

      if (
        command !== 'backspace' ||
        (text !== '' && anchorOffset !== 0) ||
        anchorOffset !== focusOffset
      ) {
        return 'not-handled'
      }

      const lastSubtopic = last(subtopics)

      if (!lastSubtopic) {
        return 'handled'
      }

      const newSubtopics = dropLast(1, subtopics)
      setSubtopics(newSubtopics)
      const nextOffSet = anchorOffset + lastSubtopic.length

      const content = EditorState.createWithContent(
        createStateFromText(lastSubtopic + text)
      )

      const newSelection = currentSelection.merge({
        focusOffset: nextOffSet,
        anchorOffset: nextOffSet,
      })

      const newEditorState = EditorState.forceSelection(content, newSelection)
      setEditorState(newEditorState)

      return 'handled'
    },
    [subtopics]
  )

  const divideIntoSubtopicsAtSelection = useCallback(
    (editorState: EditorState) => {
      const text = editorState.getCurrentContent().getPlainText()
      const currentSelection = editorState.getSelection()
      const start = currentSelection.getAnchorOffset()
      const end = currentSelection.getFocusOffset()
      const isMaximumSubtopicsReached = isMaximumSubtopics(subtopics)

      if (isMaximumSubtopicsReached) {
        console.log('max reached!')
        return
      }

      const [subtopicText, leftoverText] = insertText('/', text, {
        start,
        end,
      }).split('/')

      const trimmedSubtopicText = subtopicText.trim()

      if (trimmedSubtopicText.length > TOPIC_MAX_LENGTH) {
        console.log('too long!')
        return
      }

      if (trimmedSubtopicText.length < TOPIC_MIN_LENGTH) {
        console.log('too short!')
        return
      }

      setSubtopics([...subtopics, trimmedSubtopicText])

      const content = EditorState.createWithContent(
        createStateFromText(leftoverText)
      )

      const newSelection = currentSelection.merge({
        anchorOffset: 0,
        focusOffset: 0,
      })

      const newEditorState = EditorState.forceSelection(content, newSelection)
      setEditorState(newEditorState)
    },
    [subtopics]
  )

  const handleReturn = useCallback(
    (
      _: KeyboardEvent<Record<string, never>>,
      editorState: EditorState
    ): DraftHandleValue => {
      const text = editorState.getCurrentContent().getPlainText()

      if (!text) {
        return 'handled'
      }

      divideIntoSubtopicsAtSelection(editorState)
      return 'handled'
    },
    [divideIntoSubtopicsAtSelection]
  )

  const handleBeforeInput = useCallback(
    (command: string, editorState: EditorState): DraftHandleValue => {
      const text = editorState.getCurrentContent().getPlainText()
      if (!/[A-Za-z0-9" "/]/.test(command)) {
        return 'handled'
      }

      if (command !== '/') {
        return 'not-handled'
      }

      if (!text) {
        return 'handled'
      }

      divideIntoSubtopicsAtSelection(editorState)
      return 'handled'
    },
    [divideIntoSubtopicsAtSelection]
  )

  const handleSubtopicDelete = (index: number) => () => {
    setSubtopics(remove(index, 1, subtopics))
  }

  const handlePastedText = useCallback(
    (text: string, _: string, editorState: EditorState): DraftHandleValue => {
      const removedSpecialChars = text.replace(/[^a-zA-Z" "/]/g, '')
      const plainText = editorState.getCurrentContent().getPlainText()
      const currentSelection = editorState.getSelection()
      const anchorOffset = currentSelection.getAnchorOffset()
      const focusOffset = currentSelection.getFocusOffset()

      const textSubtopics = insertText(removedSpecialChars, plainText, {
        start: anchorOffset,
        end: focusOffset,
      }).split('/')

      const lastSubtopicPastedText = last(removedSpecialChars.split('/'))
      const completeSubtopics = dropLast(1, textSubtopics)

      const trimmedCompleteSubtopics = completeSubtopics.map(subtopic =>
        subtopic.trim()
      )

      const incompleteSubtopic = last(textSubtopics)

      const completeSubtopicsLengthRemoved = trimmedCompleteSubtopics.filter(
        ({ length }) => length >= TOPIC_MIN_LENGTH && length <= TOPIC_MAX_LENGTH
      )

      setSubtopics([...subtopics, ...completeSubtopicsLengthRemoved])

      if (!incompleteSubtopic) {
        return 'handled'
      }

      const content = EditorState.createWithContent(
        createStateFromText(incompleteSubtopic)
      )

      const newSelectionIndex = lastSubtopicPastedText?.length ?? 0

      const newSelection = currentSelection.merge({
        anchorOffset: newSelectionIndex,
        focusOffset: newSelectionIndex,
      })

      const newEditorState = EditorState.forceSelection(content, newSelection)
      setEditorState(newEditorState)
      return 'handled'
    },
    [subtopics]
  )

  const placeholder =
    subtopics.length > 0 ? 'Add a subtopic.' : 'Give your post a topic.'

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'min-content minmax(0, 1fr)',
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
          <AlternateEmailRounded color="action" />
        </Box>
        <Box sx={{ pt: 1 }}>
          <Box
            sx={{
              '&::-webkit-scrollbar': { width: 0, height: 0 },
              display: 'flex',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {subtopics.map((subtopic, index) => (
              <Fragment key={`${subtopic}}-${index}`}>
                <Chip
                  label={subtopic}
                  onDelete={handleSubtopicDelete(index)}
                  sx={{
                    height: '25px',
                    '.MuiSvgIcon-root': {
                      marginRight: 0.25,
                    },
                    '.MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
                <>&ensp;/&ensp;</>
              </Fragment>
            ))}
            <Typography
              component="div"
              variant="body1"
              sx={{
                flexGrow: 1,
                '.public-DraftEditorPlaceholder-root, .public-DraftEditorPlaceholder-hasFocus':
                  {
                    color: 'text.disabled',
                  },
                '.public-DraftEditorPlaceholder-inner, .public-DraftEditor-contentm .public-DraftStyleDefault-block':
                  {
                    whiteSpace: 'nowrap !important',
                  },
              }}
            >
              <Editor
                editorState={editorState}
                handleBeforeInput={handleBeforeInput}
                handleKeyCommand={handleKeyCommand}
                handlePastedText={handlePastedText}
                handleReturn={handleReturn}
                onChange={onEditorStateChange}
                placeholder={placeholder}
                preserveSelectionOnBlur
                stripPastedStyles
              />
            </Typography>
          </Box>
          <Box
            sx={{
              opacity: displaySubTopicInstruction ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          >
            <Typography variant="caption" color="action.active">
              Use / for subtopics.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default TopicSelect
