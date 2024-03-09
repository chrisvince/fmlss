import { CreatePostAttachment, PostAttachmentType } from '../types'
import { PostAttachmentInput } from './draft-js/usePostBodyEditorState'

const mapPostAttachmentInputToCreatePostAttachment = (
  trackedMatch: PostAttachmentInput
): CreatePostAttachment => {
  switch (trackedMatch.type) {
    case PostAttachmentType.Tiktok:
      return {
        type: PostAttachmentType.Tiktok,
        url: trackedMatch.url,
      }
    case PostAttachmentType.Url:
    case PostAttachmentType.Facebook:
    case PostAttachmentType.Instagram:
      return {
        type: PostAttachmentType.Url,
        url: trackedMatch.url,
      }
    case PostAttachmentType.Twitter:
      return {
        type: PostAttachmentType.Twitter,
        url: trackedMatch.url,
      }
    case PostAttachmentType.Youtube:
      return {
        type: PostAttachmentType.Youtube,
        url: trackedMatch.url,
      }
  }

  throw new Error('Invalid attachment type')
}

export default mapPostAttachmentInputToCreatePostAttachment
