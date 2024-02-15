import { resolvePostAttachmentTypeFromUrl } from '../../utils/socialPlatformUrls'
import CloseButtonWrapper from '../CloseButtonWrapper'
import { PostAttachmentType } from '../../types'
import useUrlMeta from '../../utils/data/urlMeta/useUrlMeta'
import PostAttachmentUrl from '../PostAttachmentUrl'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'

interface Props {
  onClose?: () => void
  onError?: (error: Error) => void
  postAttachment: PostAttachmentInput
}

const PostBodyAttachmentUrl = ({ onClose, onError, postAttachment }: Props) => {
  const isUrlLink =
    resolvePostAttachmentTypeFromUrl(postAttachment.url) ===
    PostAttachmentType.Url

  const { data, error, isLoading } = useUrlMeta(
    isUrlLink ? postAttachment.url : null,
    { onError }
  )

  if (!isUrlLink || isLoading || error || !data) {
    return null
  }

  return (
    <CloseButtonWrapper onClose={onClose}>
      <PostAttachmentUrl attachment={data} onClose={onClose} />
    </CloseButtonWrapper>
  )
}

export default PostBodyAttachmentUrl
