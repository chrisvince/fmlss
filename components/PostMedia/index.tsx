import PostAttachmentBorder from '../PostAttachmentBorder'
import MediaGrid from '../MediaGrid'
import { Media } from '../../types/Media'
import { ButtonBase } from '@mui/material'
import { useState } from 'react'
import resolveSrcSetFromMediaSrcs from '../../utils/resolveSrcSetFromMediaSrcs'
import dynamic from 'next/dynamic'

const MediaFullscreenGallery = dynamic(
  () => import('../MediaFullscreenGallery')
)

interface Props {
  media: Media[]
}

const PostMedia = ({ media }: Props) => {
  const renderAsGrid = media.length >= 2
  const [renderDialog, setRenderDialog] = useState(false)

  const [currentMediaIndex, setCurrentMediaIndex] = useState<
    number | undefined
  >()

  if (!renderDialog && currentMediaIndex !== undefined) {
    setRenderDialog(true)
  }

  const dialogOpen = currentMediaIndex !== undefined

  const handlePictureClick = (index: number) => () => {
    setCurrentMediaIndex(index)
  }

  const handleCloseDialog = () => {
    setCurrentMediaIndex(undefined)
  }

  const handleNextClick = () => {
    if (currentMediaIndex === undefined) return

    const nextIndex = currentMediaIndex + 1

    if (nextIndex >= media.length) {
      setCurrentMediaIndex(0)
      return
    }

    setCurrentMediaIndex(nextIndex)
  }

  const handlePreviousClick = () => {
    if (currentMediaIndex === undefined) return

    const previousIndex = currentMediaIndex - 1

    if (previousIndex < 0) {
      setCurrentMediaIndex(media.length - 1)
      return
    }

    setCurrentMediaIndex(previousIndex)
  }

  const handleIndexChange = (index: number) => {
    setCurrentMediaIndex(index)
  }

  return (
    <>
      <MediaGrid gridLayout={renderAsGrid}>
        {media.map((mediaItem, index) => (
          <PostAttachmentBorder key={mediaItem.id}>
            <ButtonBase onClick={handlePictureClick(index)}>
              <picture>
                <source
                  srcSet={resolveSrcSetFromMediaSrcs(mediaItem.srcs)}
                  type="image/webp"
                />
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
            </ButtonBase>
          </PostAttachmentBorder>
        ))}
      </MediaGrid>
      {renderDialog && (
        <MediaFullscreenGallery
          media={media}
          onClose={handleCloseDialog}
          open={dialogOpen}
          onNext={handleNextClick}
          currentIndex={currentMediaIndex}
          onPrevious={handlePreviousClick}
          onChange={handleIndexChange}
        />
      )}
    </>
  )
}

export default PostMedia
