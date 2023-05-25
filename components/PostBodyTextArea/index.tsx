import {
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import createHashtagPlugin, { HashtagProps } from '@draft-js-plugins/hashtag'
import { convertFromRaw, EditorState } from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import 'draft-js/dist/Draft.css'
import { Avatar, Typography, useTheme } from '@mui/material'
import createLinkifyPlugin, { extractLinks } from '@draft-js-plugins/linkify'
import { Box } from '@mui/system'
import { ComponentProps } from '@draft-js-plugins/linkify/lib/Link/Link'
import debounce from 'lodash.debounce'
import { Match } from 'linkify-it'

import constants from '../../constants'
import {
  PostPreview as PostPreviewType,
  PostPreviewFacebook,
  PostPreviewInstagram,
  PostPreviewMeta,
  PostPreviewPinterest,
  PostPreviewTikTok,
  PostPreviewTwitter,
  PostPreviewYouTube,
} from '../../types'
import getMetaFromUrl, { UrlMeta } from '../../utils/getMetaFromUrl'
import numeral from 'numeral'
import {
  isFacebookPostUrl,
  isInstagramPostUrl,
  isPinterestPostUrl,
  isTikTokPostUrl,
  isTwitterPostUrl,
  isYouTubePostUrl,
} from '../../utils/socialPlatformUrls'
import { TrackedLinkPreview } from '../../types/TrackedLinkPreview'
import PostBodyPreviews from '../PostBodyPreviews'

const { POST_MAX_LENGTH } = constants

const POST_WARNING_LENGTH = POST_MAX_LENGTH - 80
const MAX_POST_PREVIEWS = 2

const formatPostLength = (length: number | undefined) =>
  numeral(length ?? 0).format('0,0')

const preprocessTrackedLinkPreview = (
  trackedLinkPreview: TrackedLinkPreview[],
  links: Match[]
) =>
  trackedLinkPreview.reduce((acc, ye) => {
    const existingLink = links.some(({ url }) => url === ye.match.url)

    if (!existingLink && ye.closed) {
      return acc
    }

    if (!existingLink) {
      return [...acc, { ...ye, inBody: false }]
    }

    return [...acc, ye]
  }, [] as TrackedLinkPreview[])

const checkTrackedLinkPreviewEquality = (
  aTrackedLinkPreview: TrackedLinkPreview[],
  bTrackedLinkPreview: TrackedLinkPreview[]
) => {
  if (aTrackedLinkPreview.length !== bTrackedLinkPreview.length) return false

  return aTrackedLinkPreview.every(a => {
    const b = bTrackedLinkPreview.find(({ match }) => match.url === a.match.url)
    if (!b) return false

    return [a.closed === b.closed, a.inBody === b.inBody].every(x => x)
  })
}

const mapUrlMetaToPostPreview = (
  meta: UrlMeta | undefined,
  url: string
): PostPreviewMeta => {
  const { href, host } = new URL(url)
  return {
    description: meta?.description,
    href,
    image: meta?.image
      ? {
          src: meta.image,
          alt: meta.title,
        }
      : undefined,
    subtitle: host,
    title: meta?.siteName,
    type: 'url',
  }
}

export enum postLengthStatusType {
  warning = 'warning',
  error = 'error',
  none = 'none',
}

const Hashtag = ({ children }: HashtagProps) => (
  <Typography color="secondary" component="span">
    {children}
  </Typography>
)

const LinkifyLink = ({ children }: ComponentProps) => (
  <Typography color="secondary" component="span">
    {children}
  </Typography>
)

const hashtagPlugin = createHashtagPlugin({
  hashtagComponent: Hashtag,
})

const linkifyPlugin = createLinkifyPlugin({
  component: LinkifyLink,
})

const removeDuplicateTrackedPostPreviewReducer = (
  acc: TrackedLinkPreview[],
  linkPreview: TrackedLinkPreview
) => {
  const existingLink = acc.find(({ id }) => id === linkPreview.id)
  return existingLink ? acc : [...acc, linkPreview]
}

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

export interface PostBodyTextAreaRef {
  linkPreviews: PostPreviewType[]
  value: string
}

type Props = {
  disabled?: boolean
  focusOnMount?: boolean
  onChange?: (text: string) => void
  onCommandEnter?: () => void
  onLengthStatusChange?: (status: postLengthStatusType) => void
  placeholder?: string
  username?: string
}

const PostBodyTextArea = (
  {
    disabled,
    focusOnMount,
    onChange,
    onCommandEnter,
    onLengthStatusChange,
    placeholder,
    username,
  }: Props,
  ref: React.Ref<PostBodyTextAreaRef>
) => {
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createWithContent(emptyContentState)
  )

  const [postLengthStatus, setPostLengthStatus] =
    useState<postLengthStatusType>(postLengthStatusType.none)

  const [trackedLinkPreviews, setTrackedLinkPreviews] = useState<
    TrackedLinkPreview[]
  >([])

  const displayedTrackedLinkPreviews = useMemo(
    () =>
      trackedLinkPreviews
        .filter(({ closed }) => !closed)
        .reduce(removeDuplicateTrackedPostPreviewReducer, [])
        .slice(0, MAX_POST_PREVIEWS),
    [trackedLinkPreviews]
  )

  const editorRef = useRef<Editor>()
  const { palette } = useTheme()

  useEffect(() => {
    if (!focusOnMount) return

    setTimeout(() => {
      if (!editorRef.current) return
      editorRef.current.focus()
    }, 0)
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

  const avatarLetter = username?.charAt(0).toUpperCase()
  const value = editorState?.getCurrentContent().getPlainText()
  const links = extractLinks(value)

  useImperativeHandle(
    ref,
    () => ({
      linkPreviews: displayedTrackedLinkPreviews.map(
        ({ linkPreview }) => linkPreview
      ),
      value,
    }),
    [displayedTrackedLinkPreviews, value]
  )

  useEffect(() => {
    if (value.length > POST_MAX_LENGTH) {
      setPostLengthStatus(postLengthStatusType.error)
      onLengthStatusChange?.(postLengthStatusType.error)
      return
    }
    if (value.length >= POST_WARNING_LENGTH) {
      setPostLengthStatus(postLengthStatusType.warning)
      onLengthStatusChange?.(postLengthStatusType.warning)
      return
    }
    setPostLengthStatus(postLengthStatusType.none)
    onLengthStatusChange?.(postLengthStatusType.none)
  }, [onLengthStatusChange, value])

  const handleLinkPreviewClose = useCallback((id: string) => {
    setTrackedLinkPreviews(currentTrackedLinkPreviews =>
      currentTrackedLinkPreviews.reduce((acc, currentTrackedLinkPreview) => {
        if (currentTrackedLinkPreview.id !== id) {
          return [...acc, currentTrackedLinkPreview]
        }

        if (!currentTrackedLinkPreview.inBody) {
          return acc
        }

        const newPayload: TrackedLinkPreview = {
          ...currentTrackedLinkPreview,
          closed: true,
        }

        return [...acc, newPayload]
      }, [] as TrackedLinkPreview[])
    )
  }, [])

  const updateTrackedLinkPreviews = useCallback(
    async (links: Match[]) => {
      const run = async () => {
        const newTrackedLinkPreviews = await links.reduce(async (acc, link) => {
          const { href } = new URL(link.url)
          const existingLink = trackedLinkPreviews.some(({ id }) => id === href)

          if (existingLink) {
            return acc
          }

          let postPreview

          if (isTwitterPostUrl(link.url)) {
            postPreview = {
              href: link.url,
              type: 'twitter',
            } as PostPreviewTwitter
          } else if (isFacebookPostUrl(link.url)) {
            postPreview = {
              href: link.url,
              type: 'facebook',
            } as PostPreviewFacebook
          } else if (isInstagramPostUrl(link.url)) {
            postPreview = {
              href: link.url,
              type: 'instagram',
            } as PostPreviewInstagram
          } else if (isTikTokPostUrl(link.url)) {
            postPreview = {
              href: link.url,
              type: 'tiktok',
            } as PostPreviewTikTok
          } else if (isYouTubePostUrl(link.url)) {
            postPreview = {
              href: link.url,
              type: 'youtube',
            } as PostPreviewYouTube
          } else if (isPinterestPostUrl(link.url)) {
            postPreview = {
              href: link.url,
              type: 'pinterest',
            } as PostPreviewPinterest
          } else {
            const meta = await getMetaFromUrl(link.url)
            postPreview = mapUrlMetaToPostPreview(
              meta,
              link.url
            ) as PostPreviewMeta
          }

          const newLink: TrackedLinkPreview = {
            closed: false,
            id: href,
            linkPreview: postPreview,
            match: link,
            inBody: true,
          }

          return [...(await acc), newLink]
        }, Promise.resolve(trackedLinkPreviews))

        const trackedLinkPreviewsEqual = checkTrackedLinkPreviewEquality(
          trackedLinkPreviews,
          newTrackedLinkPreviews
        )

        if (trackedLinkPreviewsEqual) return
        setTrackedLinkPreviews(newTrackedLinkPreviews)
      }

      run()
    },
    [trackedLinkPreviews]
  )

  const debouncedUpdateTrackedLinkPreviews = useMemo(
    () => debounce(updateTrackedLinkPreviews, 1000),
    [updateTrackedLinkPreviews]
  )

  useEffect(() => {
    setTrackedLinkPreviews(currentTrackedLinkPreviews => {
      const neww = preprocessTrackedLinkPreview(
        currentTrackedLinkPreviews,
        links || []
      )

      if (checkTrackedLinkPreviewEquality(currentTrackedLinkPreviews, neww)) {
        return currentTrackedLinkPreviews
      }

      return neww
    })

    debouncedUpdateTrackedLinkPreviews(links || [])
  }, [debouncedUpdateTrackedLinkPreviews, links])

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'min-content 1fr',
          alignItems: 'start',
          gap: 2,
        }}
      >
        <Box>
          <Avatar>{avatarLetter}</Avatar>
        </Box>
        <Box sx={{ paddingTop: 1 }}>
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
              editorState={editorState}
              handleReturn={handleReturn}
              onChange={onEditorStateChange}
              placeholder={placeholder}
              plugins={[linkifyPlugin, hashtagPlugin]}
              preserveSelectionOnBlur={true}
              readOnly={disabled}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ref={editorRef}
              stripPastedStyles
            />
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              visibility:
                value?.length > POST_WARNING_LENGTH ? 'visible' : 'hidden',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight:
                  postLengthStatus === postLengthStatusType.warning ||
                  postLengthStatus === postLengthStatusType.error
                    ? 'bold'
                    : undefined,
                color:
                  postLengthStatus === postLengthStatusType.error
                    ? 'error.main'
                    : postLengthStatus === postLengthStatusType.warning
                    ? 'warning.main'
                    : undefined,
              }}
            >
              {formatPostLength(value?.length ?? 0)}/
              {formatPostLength(POST_MAX_LENGTH)}
            </Typography>
          </Box>
        </Box>
      </Box>
      {displayedTrackedLinkPreviews.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <PostBodyPreviews
            onClose={id => handleLinkPreviewClose(id)}
            trackedLinkPreviews={displayedTrackedLinkPreviews}
          />
        </Box>
      )}
    </Box>
  )
}

export default forwardRef(PostBodyTextArea)
