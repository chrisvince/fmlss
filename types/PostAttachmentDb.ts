import { PostAttachmentType } from '.'

interface PostAttachmentDbBase {
  href: string
  type: PostAttachmentType
}

export interface PostAttachmentDbUrl extends PostAttachmentDbBase {
  type: PostAttachmentType.Url
}

export interface PostAttachmentDbTwitter extends PostAttachmentDbBase {
  type: PostAttachmentType.Twitter
}

export interface PostAttachmentDbFacebook extends PostAttachmentDbBase {
  type: PostAttachmentType.Facebook
}

export interface PostAttachmentDbInstagram extends PostAttachmentDbBase {
  type: PostAttachmentType.Instagram
}

export interface PostAttachmentDbTikTok extends PostAttachmentDbBase {
  type: PostAttachmentType.Tiktok
}

export interface PostAttachmentDbYouTube extends PostAttachmentDbBase {
  type: PostAttachmentType.Youtube
}

export interface PostAttachmentDbPinterest extends PostAttachmentDbBase {
  type: PostAttachmentType.Pinterest
}

export type PostAttachmentDb =
  | PostAttachmentDbUrl
  | PostAttachmentDbTwitter
  | PostAttachmentDbFacebook
  | PostAttachmentDbInstagram
  | PostAttachmentDbTikTok
  | PostAttachmentDbYouTube
  | PostAttachmentDbPinterest
