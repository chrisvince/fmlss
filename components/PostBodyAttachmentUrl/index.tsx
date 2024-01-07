import { resolvePostAttachmentTypeFromUrl } from '../../utils/socialPlatformUrls'
import CloseButtonWrapper from '../CloseButtonWrapper'
import { TrackedMatch } from '../PostBodyTextArea'
import { PostAttachmentType } from '../../types'
import useUrlMeta from '../../utils/data/urlMeta/useUrlMeta'
import PostAttachmentUrl from '../PostAttachmentUrl'

interface Props {
  onClose?: () => void
  onError?: (error: Error) => void
  trackedMatch: TrackedMatch
}

const PostBodyAttachmentUrl = ({ onClose, onError, trackedMatch }: Props) => {
  const isUrlLink =
    resolvePostAttachmentTypeFromUrl(trackedMatch.url) ===
    PostAttachmentType.Url

  const { data, error, isLoading } = useUrlMeta(
    isUrlLink ? trackedMatch.url : null,
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
