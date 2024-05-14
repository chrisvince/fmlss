import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import createEmptyEditorState from './createEmptyEditorState'
import { EditorState, convertToRaw } from 'draft-js'
import constants from '../../constants'
import { PostAttachmentType } from '../../types'
import { Match } from 'linkify-it'
import debounce from 'lodash.debounce'
import { pipe } from 'ramda'
import { extractLinks as extractLinkifyItLinksFromText } from '@draft-js-plugins/linkify'
import mapLinkifyItMatchToPostAttachment from '../mapLinkifyItMatchToPostAttachment'
import {
  MediaInputItem,
  MediaInputItemType,
  MediaInputItemVideo,
  MediaInputItemVideoStatus,
} from '../../types/MediaInputItem'
import { Unsubscribe, doc, getFirestore, onSnapshot } from 'firebase/firestore'

const {
  MEDIA_ITEMS_MAX_COUNT,
  POST_ATTACHMENTS_MAX_COUNT,
  POST_MAX_LENGTH,
  VIDEOS_COLLECTION,
} = constants

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
  const db = getFirestore()
  const [editorState, setEditorState] = useState(createEmptyEditorState)
  const [media, setMedia] = useState<MediaInputItem[]>([])
  const subscribedVideosRef = useRef<
    { id: string; unsubscribe: Unsubscribe }[]
  >([])

  const [bodyPostAttachments, setBodyPostAttachments] = useState<
    PostAttachmentInput[]
  >([])

  const [otherPostAttachments, setOtherPostAttachments] = useState<
    PostAttachmentInput[]
  >([])

  const getRaw = (): string =>
    JSON.stringify(convertToRaw(editorState.getCurrentContent()))

  const handleAddMedia = (mediaItem: MediaInputItem) => {
    if (media.length >= MEDIA_ITEMS_MAX_COUNT) {
      return
    }
    setMedia([...media, mediaItem])
  }

  useEffect(() => {
    const subscribedVideosRefCurrent = subscribedVideosRef.current

    const pendingVideos = media.filter(
      mediaItem =>
        mediaItem.type === MediaInputItemType.Video &&
        mediaItem.status === MediaInputItemVideoStatus.Processing
    ) as MediaInputItemVideo[]

    pendingVideos.forEach(mediaItem => {
      const unsubscribe = onSnapshot(
        doc(db, VIDEOS_COLLECTION, mediaItem.passthrough),
        doc => {
          const data = doc.data() as MediaInputItemVideo

          if (!data) {
            return
          }

          if (data?.status !== MediaInputItemVideoStatus.Ready) {
            return
          }

          const newMediaItem: MediaInputItemVideo = {
            ...mediaItem,
            playbackId: data?.playbackId,
            status: MediaInputItemVideoStatus.Ready,
          }

          setMedia(currentMedia =>
            currentMedia.map(item =>
              item.id === mediaItem.id ? newMediaItem : item
            )
          )

          // remove unsubscribe fn from subscribedVideosRef
          subscribedVideosRef.current = subscribedVideosRef.current.filter(
            ({ id }) => id !== mediaItem.id
          )

          unsubscribe()
        }
      )

      subscribedVideosRef.current.push({ id: mediaItem.id, unsubscribe })
    })

    return () => {
      subscribedVideosRefCurrent.forEach(({ unsubscribe }) => unsubscribe())
    }
  }, [db, media])

  const handleRemoveMedia = (id: string) => {
    setMedia(currentMedia =>
      currentMedia.filter(mediaItem => mediaItem.id !== id)
    )
  }

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

  const canSubmit = !overMaxLength && (hasText || media.length > 0)

  return {
    canSubmit,
    closePostAttachment: handlePostAttachmentClose,
    editorState,
    getRaw,
    hasText,
    media,
    onAddMedia: handleAddMedia,
    onRemoveMedia: handleRemoveMedia,
    onUrlAdd: handleUrlAdd,
    overMaxLength,
    postAttachments: openPostAttachments,
    setEditorState: handleSetEditorState,
    textLength,
  }
}

export default usePostBodyEditorState
