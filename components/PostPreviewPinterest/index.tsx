import { PinterestEmbed } from 'react-social-media-embed'

import { PostPreviewPinterest as PostPreviewPinterestType } from '../../types'
import CloseButtonWrapper from '../CloseButtonWrapper'

interface Props {
  onClose?: () => void
  postPreview: PostPreviewPinterestType
}

const PostPreviewPinterest = ({ onClose, postPreview }: Props) => (
  <CloseButtonWrapper onClose={onClose}>
    <PinterestEmbed url={postPreview.href} />
  </CloseButtonWrapper>
)

export default PostPreviewPinterest
