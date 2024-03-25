import { Match } from 'linkify-it'
import { PostAttachmentInput } from './draft-js/usePostBodyEditorState'
import { resolvePostAttachmentTypeFromUrl } from './socialPlatformUrls'

const mapLinkifyItMatchToPostAttachment = (
  match: Match
): PostAttachmentInput => ({
  closed: false,
  match,
  type: resolvePostAttachmentTypeFromUrl(match.url),
  url: match.url,
})

export default mapLinkifyItMatchToPostAttachment
