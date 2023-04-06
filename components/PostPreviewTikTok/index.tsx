import { TikTokEmbed } from 'react-social-media-embed'

import { PostPreviewTikTok as PostPreviewTikTokType } from '../../types'
import CloseButtonWrapper from '../CloseButtonWrapper'

interface Props {
  onClose?: () => void
  postPreview: PostPreviewTikTokType
}

const PostPreviewTikTok = ({ onClose, postPreview }: Props) => (
  <CloseButtonWrapper onClose={onClose}>
    <TikTokEmbed url={postPreview.href} />
  </CloseButtonWrapper>
)

export default PostPreviewTikTok
