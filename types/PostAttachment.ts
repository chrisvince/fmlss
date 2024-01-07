import { Image } from '.'

export enum PostAttachmentType {
  Url = 'url',
  Twitter = 'twitter',
  Facebook = 'facebook',
  Instagram = 'instagram',
  Tiktok = 'tiktok',
  Youtube = 'youtube',
  Pinterest = 'pinterest',
}

export interface PostAttachmentUrl {
  description: string
  href: string
  image: {
    alt: string
    height?: number
    src: string
    width?: number
  } | null
  subtitle: string
  title: string
  type: PostAttachmentType.Url
}

export interface PostAttachmentTwitter {
  href: string
  type: PostAttachmentType.Twitter
}

export interface PostAttachmentFacebook {
  href: string
  type: PostAttachmentType.Facebook
}

export interface PostAttachmentInstagram {
  href: string
  type: PostAttachmentType.Instagram
}

export interface PostAttachmentTikTok {
  href: string
  image: Image
  textHtml: string
  type: PostAttachmentType.Tiktok
}

export interface PostAttachmentYouTube {
  href: string
  type: PostAttachmentType.Youtube
}

export interface PostAttachmentPinterest {
  href: string
  type: PostAttachmentType.Pinterest
}

export type PostAttachment =
  | PostAttachmentUrl
  | PostAttachmentTwitter
  | PostAttachmentFacebook
  | PostAttachmentInstagram
  | PostAttachmentTikTok
  | PostAttachmentYouTube
  | PostAttachmentPinterest
