import { TwitterEmbed } from 'react-social-media-embed'

import { PostPreviewTwitter as PostPreviewTwitterType } from '../../types'
import CloseButtonWrapper from '../CloseButtonWrapper'

const getTweetIdFromHref = (href: string) =>
  href.split('/status/')[1]?.split('?')[0]
interface Props {
  onClose?: () => void
  postPreview: PostPreviewTwitterType
}

const PostPreviewTwitter = ({ onClose, postPreview }: Props) => (
  <CloseButtonWrapper onClose={onClose}>
    <TwitterEmbed
      url={postPreview.href}
      twitterTweetEmbedProps={{
        options: { conversation: 'none' },
        tweetId: getTweetIdFromHref(postPreview.href),
      }}
    />
  </CloseButtonWrapper>
)

export default PostPreviewTwitter
