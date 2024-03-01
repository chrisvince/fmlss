import { useCallback, useMemo, useState } from 'react'
import createEmptyEditorState from './createEmptyEditorState'
import { EditorState, convertToRaw } from 'draft-js'
import constants from '../../constants'
import { PostAttachmentType } from '../../types'
import { Match } from 'linkify-it'
import debounce from 'lodash.debounce'
import { pipe } from 'ramda'
import { extractLinks as extractLinkifyItLinksFromText } from '@draft-js-plugins/linkify'
import { resolvePostAttachmentTypeFromUrl } from '../../utils/socialPlatformUrls'

const { POST_MAX_LENGTH, POST_ATTACHMENTS_MAX } = constants

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

const convertLinkifyItMatchToPostAttachment = (
  match: Match
): PostAttachmentInput => ({
  closed: false,
  match,
  type: resolvePostAttachmentTypeFromUrl(match.url),
  url: match.url,
})

const mergePostAttachments = (
  newPostAttachments: PostAttachmentInput[] = [],
  existingPostAttachments: PostAttachmentInput[] = []
) =>
  newPostAttachments.map(newPostAttachment => {
    const existingPostAttachment = existingPostAttachments.find(
      ({ url }) => url === newPostAttachment.url
    )

    if (!existingPostAttachment) {
      return newPostAttachment
    }

    return {
      ...newPostAttachment,
      closed: existingPostAttachment.closed,
    }
  })

const removeUrlText = (text: string, urlTexts: string[]): string => {
  if (urlTexts.length === 0) {
    return text
  }

  const pattern = urlTexts.join('|')
  const regex = new RegExp(pattern, 'gi')
  return text.replace(regex, '##########')
}

const usePostBodyEditorState = () => {
  const [editorState, setEditorState] = useState(createEmptyEditorState)
  const [postAttachments, setPostAttachments] = useState<PostAttachmentInput[]>(
    []
  )

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
            links => links.map(convertLinkifyItMatchToPostAttachment),
            newPostAttachments =>
              setPostAttachments(existingPostAttachments =>
                mergePostAttachments(
                  newPostAttachments,
                  existingPostAttachments
                )
              )
          )(editorState),
        600
      ),
    []
  )

  const handlePostAttachmentClose = useCallback((url: string) => {
    setPostAttachments(currentLinks =>
      currentLinks.map(currentLink => {
        if (currentLink.url !== url) {
          return currentLink
        }

        return {
          ...currentLink,
          closed: true,
        }
      })
    )
  }, [])

  const handleSetEditorState = (newEditorState: EditorState) => {
    setEditorState(newEditorState)
    updatePostAttachments(newEditorState)
  }

  const openPostAttachments = useMemo(
    () =>
      postAttachments
        .filter(({ closed }) => !closed)
        .slice(0, POST_ATTACHMENTS_MAX),
    [postAttachments]
  )

  const textLength = useMemo(() => {
    const attachmentUrlTexts = postAttachments.map(({ match }) => match.text)

    const textUrlsRemoved = removeUrlText(
      getPlainTextFromEditorState(editorState),
      attachmentUrlTexts
    )

    return textUrlsRemoved.length
  }, [editorState, postAttachments])

  const overMaxLength = useMemo(
    () => textLength > POST_MAX_LENGTH,
    [textLength]
  )

  const hasText = textLength > 0

  return {
    closePostAttachment: handlePostAttachmentClose,
    editorState,
    getRaw,
    hasText,
    overMaxLength,
    postAttachments: openPostAttachments,
    setEditorState: handleSetEditorState,
    textLength,
  }
}

export default usePostBodyEditorState
