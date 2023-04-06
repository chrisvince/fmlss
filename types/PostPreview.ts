export interface PostPreviewMeta {
  description?: string
  href: string
  image?: {
    alt: string
    height?: number
    src: string
    width?: number
  }
  subtitle?: string
  title?: string
  type: 'url'
}

export interface PostPreviewTwitter {
  href: string
  type: 'twitter'
}

export interface PostPreviewFacebook {
  href: string
  type: 'facebook'
}

export interface PostPreviewInstagram {
  href: string
  type: 'instagram'
}

export interface PostPreviewTikTok {
  href: string
  type: 'tiktok'
}

export interface PostPreviewYouTube {
  href: string
  type: 'youtube'
}

export interface PostPreviewPinterest {
  href: string
  type: 'pinterest'
}

export type PostPreview =
  | PostPreviewMeta
  | PostPreviewTwitter
  | PostPreviewFacebook
  | PostPreviewInstagram
  | PostPreviewTikTok
  | PostPreviewYouTube
  | PostPreviewPinterest
