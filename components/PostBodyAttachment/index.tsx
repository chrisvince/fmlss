import dynamic from 'next/dynamic'
import { PostAttachmentType } from '../../types'
import { TrackedMatch } from '../PostBodyTextArea'
import { resolvePostAttachmentTypeFromUrl } from '../../utils/socialPlatformUrls'

const PostBodyAttachmentTiktok = dynamic(
  () => import('../PostBodyAttachmentTiktok')
)

const PostBodyAttachmentUrl = dynamic(() => import('../PostBodyAttachmentUrl'))

interface Props {
  isAboveFold?: boolean // should do something with this
  onClose?: (url: string) => void
  onError?: (error: Error) => void
  trackedMatch: TrackedMatch
}

const PostBodyAttachment = ({ onClose, onError, trackedMatch }: Props) => {
  const type = resolvePostAttachmentTypeFromUrl(trackedMatch.url)

  const handleClose = () => {
    onClose?.(trackedMatch.url)
  }

  if (type === PostAttachmentType.Tiktok) {
    return (
      <PostBodyAttachmentTiktok
        onClose={handleClose}
        trackedMatch={trackedMatch}
      />
    )
  }

  if (type === PostAttachmentType.Url) {
    return (
      <PostBodyAttachmentUrl
        onClose={handleClose}
        onError={onError}
        trackedMatch={trackedMatch}
      />
    )
  }

  return null
}

export default PostBodyAttachment
