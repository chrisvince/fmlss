import { type PostAttachment, PostAttachmentType } from '../../types'
import PostAttachmentUrl from '../PostAttachmentUrl'
import PostAttachmentTikTok from '../PostAttachmentTikTok'

interface Props {
  isAboveFold?: boolean
  attachment: PostAttachment
}

const PostAttachment = ({ isAboveFold = false, attachment }: Props) => {
  if (attachment.type === PostAttachmentType.Tiktok) {
    return <PostAttachmentTikTok attachment={attachment} />
  }

  if (attachment.type === PostAttachmentType.Url) {
    return (
      <PostAttachmentUrl isAboveFold={isAboveFold} attachment={attachment} />
    )
  }

  return null
}

export default PostAttachment
