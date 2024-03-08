import { resolvePostAttachmentTypeFromUrl } from '../../utils/socialPlatformUrls'
import CloseButtonWrapper from '../CloseButtonWrapper'
import { PostAttachmentType } from '../../types'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'
import usePostBodyAttachmentTwitter from '../../utils/data/twitter/usePostBodyAttachmentTwitter'
import PostAttachmentTwitter from '../PostAttachmentTwitter'

interface Props {
  onClose?: () => void
  onError?: (error: Error) => void
  postAttachment: PostAttachmentInput
}

const PostBodyAttachmentTwitter = ({ onClose, postAttachment }: Props) => {
  const isTwitterUrl =
    resolvePostAttachmentTypeFromUrl(postAttachment.url) ===
    PostAttachmentType.Twitter

  const { data, error, isLoading } = usePostBodyAttachmentTwitter(
    isTwitterUrl ? postAttachment.url : null
  )

  if (!isTwitterUrl || isLoading || error || !data) {
    return null
  }

  return (
    <CloseButtonWrapper onClose={onClose}>
      <PostAttachmentTwitter attachment={data} />
    </CloseButtonWrapper>
  )
}

export default PostBodyAttachmentTwitter
