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
import titlify from '../../utils/titleify'

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

interface TopicSegment {
  path: string
  slug: string
  title: string
}

const isMaximumSegments = (segments: TopicSegment[]) =>
  segments.length >= TOPIC_MAX_SUBTOPICS - 1

interface Props {
  onChange?: (value: string) => void
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

  const [segments, setSegments] = useState<TopicSegment[]>([])

  const addSegments = useCallback((text: string[]) => {
    setSegments(currentSegments =>
      [...currentSegments, ...text].reduce<TopicSegment[]>(
        (acc, segment, index) => {
          if (typeof segment === 'string') {
            const lastItem = acc[index - 1]
            const slug = slugify(segment)
            return [
              ...acc,
              {
                path: `${lastItem ? `${lastItem.path}/` : ''}${slug}`,
                slug,
                title: titlify(segment),
              },
            ]
          }
          return [...acc, segment]
        },
        []
      )
    )
  }, [])

  const onEditorStateChange = useCallback(
    (editorState: EditorState) => {
      const plainText = editorState.getCurrentContent().getPlainText()
      setEditorState(editorState)
      onChange?.(plainText)

      if (plainText) {
        setDisplaySubTopicInstruction(true)
      }

      if (plainText.length < 2) {
        clear()
        return
      }

      debouncedSearch(plainText)
    },
    [clear, debouncedSearch, onChange]
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

      const lastSegment = last(segments)

      if (!lastSegment) {
        return 'handled'
      }

      const newSegments = dropLast(1, segments)
      setSegments(newSegments)
      const nextOffSet = anchorOffset + lastSegment.title.length

      const content = EditorState.createWithContent(
        createStateFromText(lastSegment.title + text)
      )

      const newSelection = currentSelection.merge({
        focusOffset: nextOffSet,
        anchorOffset: nextOffSet,
      })

      const newEditorState = EditorState.forceSelection(content, newSelection)
      setEditorState(newEditorState)

      return 'handled'
    },
    [segments]
  )

  const divideIntoSegmentsAtSelection = useCallback(
    (editorState: EditorState) => {
      const text = editorState.getCurrentContent().getPlainText()
      const currentSelection = editorState.getSelection()
      const start = currentSelection.getAnchorOffset()
      const end = currentSelection.getFocusOffset()
      const isMaximumSubtopicsReached = isMaximumSegments(segments)

      if (isMaximumSubtopicsReached) {
        console.log('max reached!')
        return
      }

      const [segment, leftoverText] = insertText('/', text, {
        start,
        end,
      }).split('/')

      const trimmedSegment = segment.trim()

      if (trimmedSegment.length > TOPIC_MAX_LENGTH) {
        console.log('too long!')
        return
      }

      if (trimmedSegment.length < TOPIC_MIN_LENGTH) {
        console.log('too short!')
        return
      }

      addSegments([trimmedSegment])

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
    [addSegments, segments]
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

      divideIntoSegmentsAtSelection(editorState)
      return 'handled'
    },
    [divideIntoSegmentsAtSelection]
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

      divideIntoSegmentsAtSelection(editorState)
      return 'handled'
    },
    [divideIntoSegmentsAtSelection]
  )

  const handleSegmentDelete = useCallback(
    (slug: string) => () => {
      const deletableSegmentIndex = segments.findIndex(
        segment => segment.slug === slug
      )

      setSegments(remove(deletableSegmentIndex, 1, segments))
    },
    [segments]
  )

  const handlePastedText = useCallback(
    (text: string, _: string, editorState: EditorState): DraftHandleValue => {
      const removedSpecialChars = text.replace(/[^a-zA-Z" "/]/g, '')
      const plainText = editorState.getCurrentContent().getPlainText()
      const currentSelection = editorState.getSelection()
      const anchorOffset = currentSelection.getAnchorOffset()
      const focusOffset = currentSelection.getFocusOffset()

      const segments = insertText(removedSpecialChars, plainText, {
        start: anchorOffset,
        end: focusOffset,
      }).split('/')

      const lastSegmentPastedText = last(removedSpecialChars.split('/'))
      const completeSegments = dropLast(1, segments)

      const trimmedCompleteSegments = completeSegments.map(segment =>
        segment.trim()
      )

      const incompleteSegment = last(segments)

      const completeSegmentsLengthRemoved = trimmedCompleteSegments.filter(
        ({ length }) => length >= TOPIC_MIN_LENGTH && length <= TOPIC_MAX_LENGTH
      )

      addSegments(completeSegmentsLengthRemoved)

      if (!incompleteSegment) {
        return 'handled'
      }

      const content = EditorState.createWithContent(
        createStateFromText(incompleteSegment)
      )

      const newSelectionIndex = lastSegmentPastedText?.length ?? 0

      const newSelection = currentSelection.merge({
        anchorOffset: newSelectionIndex,
        focusOffset: newSelectionIndex,
      })

      const newEditorState = EditorState.forceSelection(content, newSelection)
      setEditorState(newEditorState)
      return 'handled'
    },
    [addSegments]
  )

  const placeholder =
    segments.length > 0 ? 'Add a subtopic.' : 'Give your post a topic.'

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
            {segments.map(({ slug, title: name }, index) => (
              <Fragment key={`${slug}}-${index}`}>
                <Chip
                  label={name}
                  onDelete={handleSegmentDelete(slug)}
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
