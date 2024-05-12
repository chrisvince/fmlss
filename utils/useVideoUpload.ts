import * as UpChunk from '@mux/upchunk'
import { useState } from 'react'
import {
  MediaInputItemType,
  MediaInputItemVideo,
  MediaInputItemVideoStatus,
} from '../types/MediaInputItem'
import { createVideoUploadUrl } from './callableFirebaseFunctions/createVideoUploadUrl'

interface Props {
  onUploadComplete?: (data: MediaInputItemVideo) => void
}

const useVideoUpload = ({ onUploadComplete }: Props = {}) => {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File) => {
    setUploading(true)
    const postUrl = await createVideoUploadUrl()
    const { id, passthrough, url } = postUrl.data

    const upload = UpChunk.createUpload({
      endpoint: url,
      file,
      chunkSize: 5120,
    })

    upload.on('error', err => {
      setUploading(false)
      setError(err.detail)
    })

    upload.on('progress', progress => {
      setProgress(progress.detail)
    })

    upload.on('success', details => {
      console.log('Upload complete:', details)
      setUploading(false)
      setError(null)
      setProgress(0)

      onUploadComplete?.({
        id,
        passthrough,
        status: MediaInputItemVideoStatus.Processing,
        type: MediaInputItemType.Video,
      })
    })
  }

  return {
    error,
    isError: !!error,
    progress,
    upload,
    uploading,
  }
}

export default useVideoUpload
