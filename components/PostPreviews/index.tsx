import { Box } from '@mui/system'
import { memo, useEffect, useState } from 'react'
import PostLinkPreview from '../PostLinkPreview'

const NUMBER_OF_LINK_PREVIEWS = 2

const checkPropsEquality = (
  prevProps: Readonly<Props>,
  nextProps: Readonly<Props>
): boolean => {
  if (!prevProps.previews?.length && !nextProps.previews?.length) {
    return true
  }

  if (prevProps.previews?.length !== nextProps.previews?.length) {
    return false
  }

  const equal = nextProps.previews?.every(({ url }, index) => {
    const nextHref = new URL(url).href
    const prevUrl = prevProps.previews?.[index].url

    if (!prevUrl) {
      return false
    }

    const prevHref = new URL(prevUrl).href
    return nextHref === prevHref
  })
  return equal ?? false
}

interface LinkPreview {
  url: string
  type: 'link'
}

export type Preview = LinkPreview
type DisplayedPreview = LinkPreview & {
  closedByUser: boolean
}

interface Props {
  previews: Preview[]
}

const PostPreviews = memo(({ previews = [] }: Props) => {
  const [displayedPreviews, setDisplayedPreviews] = useState<
    DisplayedPreview[]
  >([])

  useEffect(() => {
    setDisplayedPreviews((currentDisplayedPreviews) =>
      previews.map(preview => {
        const findMatching = {
          link: () =>
            currentDisplayedPreviews.find(({ url }) => url === preview.url),
        }[preview.type]

        const matchingPreview = findMatching()

        if (matchingPreview) {
          return matchingPreview
        }

        return {
          ...preview,
          closedByUser: false,
        }
      })
    )
  }, [previews])


  if (!displayedPreviews.length) {
    return null
  }

  const handleLinkClose = (url: string) => () => {
    setDisplayedPreviews(currentDisplayedPreviews =>
      currentDisplayedPreviews.map(displayedPreview => {
        if (displayedPreview.url === url) {
          return {
            ...displayedPreview,
            closedByUser: true,
          }
        }

        return displayedPreview
      })
    )
  }

  const linkPreviews = displayedPreviews.filter(
    ({ closedByUser, type }) => type === 'link' && closedByUser !== true
  ).slice(0, NUMBER_OF_LINK_PREVIEWS)

  return (
    <Box>
      {linkPreviews.map(({ type, url }) => (
        <PostLinkPreview
          key={url}
          onClose={handleLinkClose(url)}
          url={url}
        />
      ))}
    </Box>
  )
}, checkPropsEquality)

PostPreviews.displayName = 'PostPreviews'

export default PostPreviews
