import { InstagramEmbed } from 'react-social-media-embed'

import { PostPreviewInstagram as PostPreviewInstagramType } from '../../types'
import CloseButtonWrapper from '../CloseButtonWrapper'

interface Props {
  onClose?: () => void
  postPreview: PostPreviewInstagramType
}

const PostPreviewInstagram = ({ onClose, postPreview }: Props) => (
  <CloseButtonWrapper onClose={onClose}>
    <InstagramEmbed placeholderDisabled url={postPreview.href} width="100%" />
  </CloseButtonWrapper>
)

export default PostPreviewInstagram
