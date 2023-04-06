import { TwitterEmbed } from 'react-social-media-embed'

import { PostPreviewTwitter as PostPreviewTwitterType } from '../../types'
import CloseButtonWrapper from '../CloseButtonWrapper'

interface Props {
  onClose?: () => void
  postPreview: PostPreviewTwitterType
}

const PostPreviewTwitter = ({ onClose, postPreview }: Props) => (
  <CloseButtonWrapper onClose={onClose}>
    <TwitterEmbed
      url={postPreview.href}
      twitterTweetEmbedProps={{ options: { conversation: 'none' } }}
    />
  </CloseButtonWrapper>
)

export default PostPreviewTwitter
