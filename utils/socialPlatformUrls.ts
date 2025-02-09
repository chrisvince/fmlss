import { PostAttachmentType } from '../types'

export const isTwitterPostUrl = (url: string) =>
  ['twitter.com/', 'x.com/'].some(condition => url.includes(condition)) &&
  url.includes('/status/')

export const isFacebookPostUrl = (url: string) =>
  ['facebook.com/', '/posts/'].every(condition => url.includes(condition))

export const isInstagramPostUrl = (url: string) =>
  url.includes('instagram.com/') &&
  ['/p/', '/reel/'].some(condition => url.includes(condition))

export const isTikTokPostUrl = (url: string) =>
  ['tiktok.com/', '/video/'].every(condition => url.includes(condition))

export const isYouTubePostUrl = (url: string) =>
  ['youtube.com/watch', '?', 'v='].every(condition =>
    url.includes(condition)
  ) ||
  ['youtube.com/shorts', '?', 'si='].every(condition =>
    url.includes(condition)
  ) ||
  url.includes('youtu.be/')

export const isPinterestPostUrl = (url: string) =>
  [
    'pinterest.at/pin',
    'pinterest.ca/pin',
    'pinterest.ch/pin',
    'pinterest.cl/pin',
    'pinterest.co.kr/pin',
    'pinterest.co.uk/pin',
    'pinterest.com.au/pin',
    'pinterest.com.mx/pin',
    'pinterest.com/pin',
    'pinterest.de/pin',
    'pinterest.dk/pin',
    'pinterest.es/pin',
    'pinterest.fr/pin',
    'pinterest.ie/pin',
    'pinterest.info/pin',
    'pinterest.it/pin',
    'pinterest.jp/pin',
    'pinterest.nz/pin',
    'pinterest.ph/pin',
    'pinterest.pt/pin',
    'pinterest.ru/pin',
    'pinterest.se/pin',
    'ru.pinterest.com/pin',
  ].some(condition => url.includes(condition))

export const resolvePostAttachmentTypeFromUrl = (
  url: string
): PostAttachmentType => {
  if (isTwitterPostUrl(url)) {
    return PostAttachmentType.Twitter
  }
  // we don't have Facebook and Instagram setup yet so disabled for now
  // if (isFacebookPostUrl(url)) {
  //   return PostAttachmentType.Facebook
  // }
  // if (isInstagramPostUrl(url)) {
  //   return PostAttachmentType.Instagram
  // }
  if (isTikTokPostUrl(url)) {
    return PostAttachmentType.Tiktok
  }
  if (isYouTubePostUrl(url)) {
    return PostAttachmentType.Youtube
  }
  if (isPinterestPostUrl(url)) {
    return PostAttachmentType.Pinterest
  }
  return PostAttachmentType.Url
}
