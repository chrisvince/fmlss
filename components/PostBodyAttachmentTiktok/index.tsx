import useTiktokAttachment from '../../utils/data/tiktok/useTiktokAttachment'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'
import { isTikTokPostUrl } from '../../utils/socialPlatformUrls'
import CloseButtonWrapper from '../CloseButtonWrapper'
import PostAttachmentTikTok from '../PostAttachmentTikTok'

interface Props {
  closingDisabled?: boolean
  onClose?: () => void
  postAttachment: PostAttachmentInput
}

const PostBodyAttachmentTiktok = ({
  closingDisabled = false,
  onClose,
  postAttachment,
}: Props) => {
  const isTiktokLink = isTikTokPostUrl(postAttachment.url)

  const { data, isLoading } = useTiktokAttachment(
    isTiktokLink ? postAttachment.url : null
  )

  if (!isTiktokLink || isLoading) {
    return null
  }

  if (!data) {
    return null
  }

  return (
    <CloseButtonWrapper disabled={closingDisabled} onClose={onClose}>
      <PostAttachmentTikTok attachment={data} />
    </CloseButtonWrapper>
  )
}

export default PostBodyAttachmentTiktok
