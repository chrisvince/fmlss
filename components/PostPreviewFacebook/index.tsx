import { FacebookEmbed } from 'react-social-media-embed'

import { PostPreviewFacebook as PostPreviewFacebookType } from '../../types'
import CloseButtonWrapper from '../CloseButtonWrapper'

interface Props {
  onClose?: () => void
  postPreview: PostPreviewFacebookType
}

const PostPreviewFacebook = ({ onClose, postPreview }: Props) => (
  <CloseButtonWrapper onClose={onClose}>
    <FacebookEmbed url={postPreview.url} />
  </CloseButtonWrapper>
)

export default PostPreviewFacebook
