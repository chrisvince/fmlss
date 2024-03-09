import { type PostAttachment, PostAttachmentType } from '../../types'
import PostAttachmentUrl from '../PostAttachmentUrl'
import PostAttachmentTikTok from '../PostAttachmentTikTok'
import PostAttachmentTwitter from '../PostAttachmentTwitter'
import PostAttachmentYouTube from '../PostAttachmentYouTube'

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

  if (attachment.type === PostAttachmentType.Twitter) {
    return <PostAttachmentTwitter attachment={attachment} />
  }

  if (attachment.type === PostAttachmentType.Youtube) {
    return <PostAttachmentYouTube attachment={attachment} />
  }

  return null
}

export default PostAttachment
