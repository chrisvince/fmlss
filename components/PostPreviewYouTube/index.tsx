import { YouTubeEmbed } from 'react-social-media-embed'

import { PostPreviewYouTube as PostPreviewYouTubeType } from '../../types'
import CloseButtonWrapper from '../CloseButtonWrapper'

interface Props {
  onClose?: () => void
  postPreview: PostPreviewYouTubeType
}

const PostPreviewYouTube = ({ onClose, postPreview }: Props) => (
  <CloseButtonWrapper onClose={onClose}>
    <YouTubeEmbed url={postPreview.url} />
  </CloseButtonWrapper>
)

export default PostPreviewYouTube
