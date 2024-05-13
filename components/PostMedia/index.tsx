import MediaGrid from '../MediaGrid'
import { Media, MediaImage, MediaType } from '../../types/Media'
import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import PostMediaImage from '../PostMediaImage'
import PostMediaVideo from '../PostMediaVideo'

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

  const imageMedia = useMemo(
    () =>
      media.filter(
        (mediaItem): mediaItem is MediaImage =>
          mediaItem.type === MediaType.Image
      ),
    [media]
  )

  return (
    <>
      <MediaGrid gridLayout={renderAsGrid}>
        {media.map((mediaItem, index) => {
          if (mediaItem.type === MediaType.Image) {
            return (
              <PostMediaImage
                isInGrid={renderAsGrid}
                key={mediaItem.id}
                media={mediaItem}
                onClick={handlePictureClick(index)}
              />
            )
          }

          if (mediaItem.type === MediaType.Video) {
            return <PostMediaVideo key={mediaItem.id} media={mediaItem} />
          }
        })}
      </MediaGrid>
      {renderDialog && (
        <MediaFullscreenGallery
          media={imageMedia}
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
