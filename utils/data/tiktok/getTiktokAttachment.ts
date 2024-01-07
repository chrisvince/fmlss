import mapTiktokOembedToAttachment, {
  TiktokOembed,
} from './mapTiktokOembedToAttachment'

const getTiktokAttachment = async (url: string) => {
  const response = await fetch(`https://www.tiktok.com/oembed?url=${url}`)
  const json = (await response.json()) as TiktokOembed
  const data = mapTiktokOembedToAttachment(json, url)
  return data
}

export default getTiktokAttachment
