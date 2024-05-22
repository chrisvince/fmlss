import { resolvePostAttachmentTypeFromUrl } from '../../utils/socialPlatformUrls'
import CloseButtonWrapper from '../CloseButtonWrapper'
import { PostAttachmentType } from '../../types'
import useUrlMeta from '../../utils/data/urlMeta/useUrlMeta'
import PostAttachmentUrl from '../PostAttachmentUrl'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'

interface Props {
  closingDisabled?: boolean
  onClose?: () => void
  onError?: (error: Error) => void
  postAttachment: PostAttachmentInput
}

const PostBodyAttachmentUrl = ({
  closingDisabled = false,
  onClose,
  onError,
  postAttachment,
}: Props) => {
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
    <CloseButtonWrapper disabled={closingDisabled} onClose={onClose}>
      <PostAttachmentUrl attachment={data} />
    </CloseButtonWrapper>
  )
}

export default PostBodyAttachmentUrl
