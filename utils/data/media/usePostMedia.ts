import { useState } from 'react'
import { MediaItem } from './useFileUpload'

const usePostMedia = () => {
  const [media, setMedia] = useState<MediaItem[]>([])

  const handleAddMedia = (mediaItem: MediaItem) => {
    setMedia([...media, mediaItem])
  }

  const handleRemoveMedia = (id: string) => {
    setMedia(currentMedia =>
      currentMedia.filter(mediaItem => mediaItem.id !== id)
    )
  }

  return {
    media,
    onAddMedia: handleAddMedia,
    onRemoveMedia: handleRemoveMedia,
  }
}

export default usePostMedia
