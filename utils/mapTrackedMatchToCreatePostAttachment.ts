import { TrackedMatch } from '../components/PostBodyTextArea'
import { CreatePostAttachment, PostAttachmentType } from '../types'

const mapTrackedMatchToCreatePostAttachment = (
  trackedMatch: TrackedMatch
): CreatePostAttachment => {
  switch (trackedMatch.type) {
    case PostAttachmentType.Tiktok:
      return {
        type: PostAttachmentType.Tiktok,
        url: trackedMatch.url,
      }
    case PostAttachmentType.Url:
      return {
        type: PostAttachmentType.Url,
        url: trackedMatch.url,
      }
  }

  throw new Error('Invalid attachment type')
}

export default mapTrackedMatchToCreatePostAttachment
