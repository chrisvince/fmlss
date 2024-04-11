import CloseButtonWrapper from '../CloseButtonWrapper'
import PostAttachmentBorder from '../PostAttachmentBorder'
import { MediaInputItem } from '../../types/MediaInputItem'
import MediaGrid from '../MediaGrid'

interface Props {
  media: MediaInputItem[]
  onClose: (id: string) => void
}

const PostMediaInput = ({ media, onClose }: Props) => {
  const closeHandler = (id: string) => () => onClose(id)

  return (
    <MediaGrid gridLayout={media.length >= 2}>
      {media.map(({ id, url, height, width }) => (
        <CloseButtonWrapper key={id} onClose={closeHandler(id)}>
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
      ))}
    </MediaGrid>
  )
}

export default PostMediaInput
