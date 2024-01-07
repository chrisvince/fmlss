import { PostAttachmentTikTok, PostAttachmentType } from '../../../types'

export interface TiktokOembed {
  author_name: string
  author_unique_id: string
  author_url: string
  embed_product_id: string
  embed_type: string
  height: string
  html: string
  provider_name: string
  provider_url: string
  thumbnail_height: number
  thumbnail_url: string
  thumbnail_width: number
  title: string
  type: string
  version: string
  width: string
}

const mapTiktokOembedToAttachment = (
  oembed: TiktokOembed,
  url: string
): PostAttachmentTikTok => ({
  href: url,
  image: {
    alt: oembed.title,
    height: oembed.thumbnail_height,
    src: oembed.thumbnail_url,
    width: oembed.thumbnail_width,
  },
  textHtml: oembed.html,
  type: PostAttachmentType.Tiktok,
})

export default mapTiktokOembedToAttachment
