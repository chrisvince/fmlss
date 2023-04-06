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
  url: string
  type: 'twitter'
}

export interface PostPreviewFacebook {
  url: string
  type: 'facebook'
}

export interface PostPreviewInstagram {
  url: string
  type: 'instagram'
}

export interface PostPreviewTikTok {
  url: string
  type: 'tiktok'
}

export interface PostPreviewYouTube {
  url: string
  type: 'youtube'
}

export interface PostPreviewPinterest {
  url: string
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
