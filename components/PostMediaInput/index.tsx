import { MediaInputItem, MediaInputItemType } from '../../types/MediaInputItem'
import MediaGrid from '../MediaGrid'
import PostMediaImageInputItem from '../PostMediaImageInputItem'
import PostMediaVideo from '../PostMediaVideoInputItem'

interface Props {
  media: MediaInputItem[]
  onClose: (id: string) => void
}

const PostMediaInput = ({ media, onClose }: Props) => {
  const closeHandler = (id: string) => () => onClose(id)

  return (
    <MediaGrid gridLayout={media.length >= 2}>
      {media.map(mediaItem => {
        if (mediaItem.type === MediaInputItemType.Image) {
          return (
            <PostMediaImageInputItem
              media={mediaItem}
              key={mediaItem.id}
              onClose={closeHandler(mediaItem.id)}
            />
          )
        }

        if (mediaItem.type === MediaInputItemType.Video) {
          return (
            <PostMediaVideo
              media={mediaItem}
              key={mediaItem.id}
              onClose={closeHandler(mediaItem.id)}
            />
          )
        }
      })}
    </MediaGrid>
  )
}

export default PostMediaInput
