import { PostAttachmentType, PostAttachmentYouTube } from '../../../types'

interface YouTubeOembedResponse {
  title: string
  author_name: string
  author_url: string
  type: string
  height: number
  width: number
  version: string
  provider_name: string
  provider_url: string
  thumbnail_height: number
  thumbnail_width: number
  thumbnail_url: string
  html: string
}

const mapYouTubeOembedToAttachment = (
  oembed: YouTubeOembedResponse,
  url: string
): PostAttachmentYouTube => ({
  href: url,
  type: PostAttachmentType.Youtube,
  title: oembed.title,
  author: {
    href: oembed.author_url,
    name: oembed.author_name,
  },
  image: {
    alt: oembed.title,
    height: oembed.thumbnail_height,
    src: oembed.thumbnail_url,
    width: oembed.thumbnail_width,
  },
})

export default mapYouTubeOembedToAttachment
