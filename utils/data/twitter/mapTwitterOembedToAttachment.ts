import { PostAttachmentTwitter, PostAttachmentType } from '../../../types'

interface TwitterOembedResponse {
  url: string
  author_name: string
  author_url: string
  html: string
  width: number
  height: number
  type: string
  cache_age: string
  provider_name: string
  provider_url: string
  version: string
}

const mapTwitterOembedToAttachment = (
  oembed: TwitterOembedResponse
): PostAttachmentTwitter => ({
  href: oembed.url,
  type: PostAttachmentType.Twitter,
  body: oembed.html,
})

export default mapTwitterOembedToAttachment
