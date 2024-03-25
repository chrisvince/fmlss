import { PostAttachmentType } from '../../types'
import { resolvePostAttachmentTypeFromUrl } from '../socialPlatformUrls'
import useTiktokAttachment from './tiktok/useTiktokAttachment'
import usePostBodyAttachmentTwitter from './twitter/usePostBodyAttachmentTwitter'
import useUrlMeta from './urlMeta/useUrlMeta'
import usePostBodyAttachmentYouTube from './youtube/usePostBodyAttachmentYouTube'

const useAttachment = (url: string | null | undefined) => {
  const attachmentType = url ? resolvePostAttachmentTypeFromUrl(url) : null

  const { data: tiktokData } = useTiktokAttachment(
    attachmentType === PostAttachmentType.Tiktok ? url : null
  )

  const { data: twitterData } = usePostBodyAttachmentTwitter(
    !tiktokData && attachmentType === PostAttachmentType.Twitter ? url : null
  )

  const { data: youtubeData } = usePostBodyAttachmentYouTube(
    !tiktokData && !twitterData && attachmentType === PostAttachmentType.Youtube
      ? url
      : null
  )

  const { data: urlData } = useUrlMeta(
    !tiktokData && !twitterData && !youtubeData ? url : null
  )

  return {
    data: tiktokData ?? twitterData ?? youtubeData ?? urlData,
  }
}

export default useAttachment
