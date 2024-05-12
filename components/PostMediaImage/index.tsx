import PostAttachmentBorder from '../PostAttachmentBorder'
import { MediaImage } from '../../types/Media'
import { ButtonBase } from '@mui/material'
import resolveSrcSetFromMediaSrcs from '../../utils/resolveSrcSetFromMediaSrcs'

interface Props {
  isInGrid: boolean
  media: MediaImage
  onClick: () => void
}

const PostMediaImage = ({ media, isInGrid, onClick }: Props) => (
  <PostAttachmentBorder key={media.id}>
    <ButtonBase onClick={onClick}>
      <picture>
        <source
          srcSet={resolveSrcSetFromMediaSrcs(media.srcs)}
          type="image/webp"
        />
        <img
          alt=""
          height={media.height}
          sizes={
            isInGrid
              ? '(max-width: 550px) 46vw, (max-width: 599px) 249px, (max-width: 825px) 33vw, (max-width: 899px) 265px, (max-width: 1290px) 20vw, 265px'
              : '(max-width: 550px) 92vw, (max-width: 599px) 516px, (max-width: 825px) 66vw, (max-width: 899px) 548px, (max-width: 1290px) 33vw, 548px'
          }
          src={media.src}
          style={{ maxWidth: '100%', height: '100%', display: 'block' }}
          width={media.width}
        />
      </picture>
    </ButtonBase>
  </PostAttachmentBorder>
)

export default PostMediaImage
