import CloseButtonWrapper from '../CloseButtonWrapper'
import PostAttachmentBorder from '../PostAttachmentBorder'
import { MediaInputItemImage } from '../../types/MediaInputItem'

interface Props {
  media: MediaInputItemImage
  onClose: () => void
}

const PostMediaImageInputItem = ({
  media: { height, id, url, width },
  onClose,
}: Props) => (
  <CloseButtonWrapper key={id} onClose={onClose}>
    <PostAttachmentBorder>
      <picture>
        <img
          alt="Uploaded image"
          height={height}
          src={url}
          style={{
            maxWidth: '100%',
            height: '100%',
            display: 'block',
          }}
          width={width}
        />
      </picture>
    </PostAttachmentBorder>
  </CloseButtonWrapper>
)

export default PostMediaImageInputItem
