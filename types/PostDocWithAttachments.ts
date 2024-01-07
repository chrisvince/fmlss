import { FirebaseDoc } from './FirebaseDoc'
import { PostAttachment } from './PostAttachment'

export interface PostDocWithAttachments {
  postDoc: FirebaseDoc
  attachments: PostAttachment[]
}
