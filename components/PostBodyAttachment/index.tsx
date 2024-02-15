import dynamic from 'next/dynamic'
import { PostAttachmentType } from '../../types'
import { resolvePostAttachmentTypeFromUrl } from '../../utils/socialPlatformUrls'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'

const PostBodyAttachmentTiktok = dynamic(
  () => import('../PostBodyAttachmentTiktok')
)

const PostBodyAttachmentUrl = dynamic(() => import('../PostBodyAttachmentUrl'))

interface Props {
  isAboveFold?: boolean // should do something with this
  onClose?: (url: string) => void
  onError?: (error: Error) => void
  postAttachment: PostAttachmentInput
}

const PostBodyAttachment = ({ onClose, onError, postAttachment }: Props) => {
  const type = resolvePostAttachmentTypeFromUrl(postAttachment.url)

  const handleClose = () => {
    onClose?.(postAttachment.url)
  }

  if (type === PostAttachmentType.Tiktok) {
    return (
      <PostBodyAttachmentTiktok
        onClose={handleClose}
        postAttachment={postAttachment}
      />
    )
  }

  if (type === PostAttachmentType.Url) {
    return (
      <PostBodyAttachmentUrl
        onClose={handleClose}
        onError={onError}
        postAttachment={postAttachment}
      />
    )
  }

  return null
}

export default PostBodyAttachment
