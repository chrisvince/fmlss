import { Image, PostAttachmentType, PostAttachmentUrl } from '../../../types'
import { Metadata } from 'html-metadata-parser'

const mapPostAttachmentUrl = (
  { meta, og }: Metadata,
  image: Image | null,
  url: string
): PostAttachmentUrl => ({
  description: meta.description ?? og.description ?? '',
  href: meta.url ?? og.url ?? url ?? '',
  image,
  subtitle: meta.site_name ?? og.site_name ?? '',
  title: meta.title ?? og.title ?? '',
  type: PostAttachmentType.Url,
})

export default mapPostAttachmentUrl
