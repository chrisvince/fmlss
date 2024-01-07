import { PostAttachmentType } from '.'

interface CreatePostAttachmentBase {
  type: PostAttachmentType
}

export interface CreatePostAttachmentTiktok extends CreatePostAttachmentBase {
  type: PostAttachmentType.Tiktok
  url: string
}

export interface CreatePostAttachmentUrl extends CreatePostAttachmentBase {
  type: PostAttachmentType.Url
  url: string
}

export type CreatePostAttachment =
  | CreatePostAttachmentTiktok
  | CreatePostAttachmentUrl
