import { useCallback, useMemo, useState } from 'react'
import createEmptyEditorState from './createEmptyEditorState'
import { EditorState, convertToRaw } from 'draft-js'
import constants from '../../constants'
import { PostAttachmentType } from '../../types'
import { Match } from 'linkify-it'
import debounce from 'lodash.debounce'
import { pipe } from 'ramda'
import { extractLinks as extractLinkifyItLinksFromText } from '@draft-js-plugins/linkify'
import mapLinkifyItMatchToPostAttachment from '../mapLinkifyItMatchToPostAttachment'

const { POST_MAX_LENGTH, POST_ATTACHMENTS_MAX_COUNT } = constants

export enum PostLengthStatusType {
  Warning = 'warning',
  Error = 'error',
  None = 'none',
}

export interface PostAttachmentInput {
  closed: boolean
  match: Match
  type: PostAttachmentType
  url: string
}

const getPlainTextFromEditorState = (editorState: EditorState): string =>
  editorState.getCurrentContent().getPlainText()

const removeDuplicateLinkifyItMatches = (links: Match[] | null): Match[] =>
  links?.reduce((acc, link) => {
    const existingLink = acc.some(({ url }) => url === link.url)
    return existingLink ? acc : [...acc, link]
  }, [] as Match[]) ?? []

const mergePostAttachments = (
  newPostAttachments: PostAttachmentInput[] = [],
  existingPostAttachments: PostAttachmentInput[] = [],
  otherPostAttachments: PostAttachmentInput[] = []
): PostAttachmentInput[] =>
  newPostAttachments.reduce<PostAttachmentInput[]>((acc, newPostAttachment) => {
    const existingPostAttachment = existingPostAttachments.find(
      ({ url }) => url === newPostAttachment.url
    )

    if (!existingPostAttachment) {
      const otherPostAttachmentExists = otherPostAttachments.some(
        ({ url }) => url === newPostAttachment.url
      )
      if (otherPostAttachmentExists) {
        return acc
      }
      return [...acc, newPostAttachment]
    }

    return [
      ...acc,
      {
        ...newPostAttachment,
        closed: existingPostAttachment.closed,
      },
    ]
  }, [])

const removeUrlText = (text: string, urlTexts: string[]): string => {
  if (urlTexts.length === 0) {
    return text
  }

  const newText = urlTexts.reduce(
    (acc, urlText) => acc.split(urlText).join('##########'),
    text
  )

  return newText
}

const postAttachmentRemover =
  (url: string) => (postAttachments: PostAttachmentInput[]) =>
    postAttachments.map(postAttachment => {
      if (postAttachment.url !== url) {
        return postAttachment
      }

      return {
        ...postAttachment,
        closed: true,
      }
    })

const usePostBodyEditorState = () => {
  const [editorState, setEditorState] = useState(createEmptyEditorState)

  const [bodyPostAttachments, setBodyPostAttachments] = useState<
    PostAttachmentInput[]
  >([])

  const [otherPostAttachments, setOtherPostAttachments] = useState<
    PostAttachmentInput[]
  >([])

  const getRaw = (): string =>
    JSON.stringify(convertToRaw(editorState.getCurrentContent()))

  const updatePostAttachments = useMemo(
    () =>
      debounce(
        (editorState: EditorState) =>
          pipe(
            getPlainTextFromEditorState,
            extractLinkifyItLinksFromText,
            removeDuplicateLinkifyItMatches,
            links => links.map(mapLinkifyItMatchToPostAttachment),
            newPostAttachments =>
              setBodyPostAttachments(existingPostAttachments =>
                mergePostAttachments(
                  newPostAttachments,
                  existingPostAttachments,
                  otherPostAttachments
                )
              )
          )(editorState),
        600
      ),
    [otherPostAttachments]
  )

  const handlePostAttachmentClose = useCallback((url: string) => {
    setBodyPostAttachments(postAttachmentRemover(url))
    setOtherPostAttachments(postAttachmentRemover(url))
  }, [])

  const handleSetEditorState = (newEditorState: EditorState) => {
    setEditorState(newEditorState)
    updatePostAttachments(newEditorState)
  }

  const openPostAttachments = useMemo(
    () =>
      [...bodyPostAttachments, ...otherPostAttachments]
        .filter(({ closed }) => !closed)
        .slice(0, POST_ATTACHMENTS_MAX_COUNT),
    [bodyPostAttachments, otherPostAttachments]
  )

  const textLength = useMemo(() => {
    const attachmentUrlTexts = bodyPostAttachments.map(
      ({ match }) => match.text
    )

    const textUrlsRemoved = removeUrlText(
      getPlainTextFromEditorState(editorState),
      attachmentUrlTexts
    )

    return textUrlsRemoved.length
  }, [editorState, bodyPostAttachments])

  const overMaxLength = useMemo(
    () => textLength > POST_MAX_LENGTH,
    [textLength]
  )

  const hasText = textLength > 0

  const handleUrlAdd = useCallback(
    (postAttachmentInput: PostAttachmentInput) => {
      const postAttachmentExists = [
        ...bodyPostAttachments,
        ...otherPostAttachments,
      ].some(({ url }) => url === postAttachmentInput.url)

      if (postAttachmentExists) {
        return
      }

      setOtherPostAttachments([...otherPostAttachments, postAttachmentInput])
    },
    [bodyPostAttachments, otherPostAttachments]
  )

  return {
    closePostAttachment: handlePostAttachmentClose,
    editorState,
    getRaw,
    hasText,
    onUrlAdd: handleUrlAdd,
    overMaxLength,
    postAttachments: openPostAttachments,
    setEditorState: handleSetEditorState,
    textLength,
  }
}

export default usePostBodyEditorState
