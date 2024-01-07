import useTiktokAttachment from '../../utils/data/tiktok/useTiktokAttachment'
import { isTikTokPostUrl } from '../../utils/socialPlatformUrls'
import CloseButtonWrapper from '../CloseButtonWrapper'
import { TrackedMatch } from '../PostBodyTextArea'
import PostAttachmentTikTok from '../PostAttachmentTikTok'

interface Props {
  onClose?: () => void
  trackedMatch: TrackedMatch
}

const PostBodyAttachmentTiktok = ({ onClose, trackedMatch }: Props) => {
  const isTiktokLink = isTikTokPostUrl(trackedMatch.url)

  const { data, isLoading } = useTiktokAttachment(
    isTiktokLink ? trackedMatch.url : null
  )

  if (!isTiktokLink || isLoading) {
    return null
  }

  if (!data) {
    return null
  }

  return (
    <CloseButtonWrapper onClose={onClose}>
      <PostAttachmentTikTok attachment={data} />
    </CloseButtonWrapper>
  )
}

export default PostBodyAttachmentTiktok
