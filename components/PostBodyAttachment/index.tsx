import dynamic from 'next/dynamic'
import { PostAttachmentType } from '../../types'
import { resolvePostAttachmentTypeFromUrl } from '../../utils/socialPlatformUrls'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'

const PostBodyAttachmentTiktok = dynamic(
  () => import('../PostBodyAttachmentTiktok')
)

const PostBodyAttachmentUrl = dynamic(() => import('../PostBodyAttachmentUrl'))

const PostBodyAttachmentTwitter = dynamic(
  () => import('../PostBodyAttachmentTwitter')
)

const PostBodyAttachmentYouTube = dynamic(
  () => import('../PostBodyAttachmentYouTube')
)

interface Props {
  closingDisabled?: boolean
  isAboveFold?: boolean // should do something with this
  onClose?: (url: string) => void
  onError?: (error: Error) => void
  postAttachment: PostAttachmentInput
}

const PostBodyAttachment = ({
  closingDisabled = false,
  onClose,
  onError,
  postAttachment,
}: Props) => {
  const type = resolvePostAttachmentTypeFromUrl(postAttachment.url)

  const handleClose = () => {
    onClose?.(postAttachment.url)
  }

  if (type === PostAttachmentType.Tiktok) {
    return (
      <PostBodyAttachmentTiktok
        closingDisabled={closingDisabled}
        onClose={handleClose}
        postAttachment={postAttachment}
      />
    )
  }

  if (type === PostAttachmentType.Url) {
    return (
      <PostBodyAttachmentUrl
        closingDisabled={closingDisabled}
        onClose={handleClose}
        onError={onError}
        postAttachment={postAttachment}
      />
    )
  }

  if (type === PostAttachmentType.Twitter) {
    return (
      <PostBodyAttachmentTwitter
        closingDisabled={closingDisabled}
        onClose={handleClose}
        onError={onError}
        postAttachment={postAttachment}
      />
    )
  }

  if (type === PostAttachmentType.Youtube) {
    return (
      <PostBodyAttachmentYouTube
        closingDisabled={closingDisabled}
        onClose={handleClose}
        onError={onError}
        postAttachment={postAttachment}
      />
    )
  }

  return null
}

export default PostBodyAttachment
