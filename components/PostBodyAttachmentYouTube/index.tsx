import { resolvePostAttachmentTypeFromUrl } from '../../utils/socialPlatformUrls'
import CloseButtonWrapper from '../CloseButtonWrapper'
import { PostAttachmentType } from '../../types'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'
import usePostBodyAttachmentYouTube from '../../utils/data/youtube/usePostBodyAttachmentYouTube'
import PostAttachmentYouTube from '../PostAttachmentYouTube'

interface Props {
  closingDisabled?: boolean
  onClose?: () => void
  onError?: (error: Error) => void
  postAttachment: PostAttachmentInput
}

const PostBodyAttachmentYouTube = ({
  closingDisabled = false,
  onClose,
  postAttachment,
}: Props) => {
  const isYouTubeUrl =
    resolvePostAttachmentTypeFromUrl(postAttachment.url) ===
    PostAttachmentType.Youtube

  const { data, error, isLoading } = usePostBodyAttachmentYouTube(
    isYouTubeUrl ? postAttachment.url : null
  )

  if (!isYouTubeUrl || isLoading || error || !data) {
    return null
  }

  return (
    <CloseButtonWrapper disabled={closingDisabled} onClose={onClose}>
      <PostAttachmentYouTube attachment={data} />
    </CloseButtonWrapper>
  )
}

export default PostBodyAttachmentYouTube
