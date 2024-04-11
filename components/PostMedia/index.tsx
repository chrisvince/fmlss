import PostAttachmentBorder from '../PostAttachmentBorder'
import MediaGrid from '../MediaGrid'
import { Media } from '../../types/Media'

const resolveSrcSet = (srcs: Media['srcs']) =>
  srcs.map(({ url, width }) => `${url} ${width}w`).join(', ')

interface Props {
  media: Media[]
}

const PostMedia = ({ media }: Props) => {
  const renderAsGrid = media.length >= 2

  return (
    <MediaGrid gridLayout={renderAsGrid}>
      {media.map(mediaItem => (
        <PostAttachmentBorder key={mediaItem.id}>
          <picture>
            <source srcSet={resolveSrcSet(mediaItem.srcs)} type="image/webp" />
            <img
              alt=""
              height={mediaItem.height}
              sizes={
                renderAsGrid
                  ? '(max-width: 550px) 46vw, (max-width: 599px) 249px, (max-width: 825px) 33vw, (max-width: 899px) 265px, (max-width: 1290px) 20vw, 265px'
                  : '(max-width: 550px) 92vw, (max-width: 599px) 516px, (max-width: 825px) 66vw, (max-width: 899px) 548px, (max-width: 1290px) 33vw, 548px'
              }
              src={mediaItem.src}
              style={{ maxWidth: '100%', height: '100%', display: 'block' }}
              width={mediaItem.width}
            />
          </picture>
        </PostAttachmentBorder>
      ))}
    </MediaGrid>
  )
}

export default PostMedia
