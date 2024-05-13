import { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import {
  MediaInputItemImage,
  MediaInputItemType,
} from '../../../types/MediaInputItem'
import constants from '../../../constants'
import getImageDimensionsFromUrlClient from '../../getImageDimensionsFromUrlClient'
import {
  getDownloadURL,
  getStorage,
  ref,
  updateMetadata,
  uploadBytesResumable,
} from 'firebase/storage'

const { POST_ASSETS_MAX_FILE_SIZE_MB } = constants

interface Options {
  onFileUploaded?: (mediaItem: MediaInputItemImage) => void
}

const useFileUpload = ({ onFileUploaded }: Options = {}) => {
  const storage = getStorage(
    undefined,
    process.env.NEXT_PUBLIC_FIREBASE_POST_ASSETS_STORAGE_BUCKET
  )

  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const isError = !!error

  const handleUploadImage = (file: File) => {
    if (file.size > POST_ASSETS_MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(
        `File size is too large. File must be less than ${POST_ASSETS_MAX_FILE_SIZE_MB}MB.`
      )
      return
    }

    setUploadProgress(0)
    setUploadInProgress(true)
    setError(null)

    const mediaId = uuidV4()
    const storageRef = ref(storage, `/${mediaId}.webp`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )

        setUploadProgress(progress)
      },
      () => {
        setUploadProgress(0)
        setUploadInProgress(false)
        setError('An error occurred while uploading the file')
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        const dimensions = await getImageDimensionsFromUrlClient(downloadURL)

        await updateMetadata(storageRef, {
          customMetadata: {
            height: `${dimensions.height}`,
            width: `${dimensions.width}`,
          },
        })

        onFileUploaded?.({
          height: dimensions.height,
          id: mediaId,
          type: MediaInputItemType.Image,
          url: downloadURL,
          width: dimensions.width,
        })

        setUploadProgress(0)
        setUploadInProgress(false)
      }
    )
  }

  const upload = (file: File) => {
    if (file.type.startsWith('image/')) {
      handleUploadImage(file)
      return
    }

    setError('File type not supported.')
    return
  }

  return {
    error,
    isError,
    upload,
    uploadInProgress,
    uploadProgress,
  }
}

export default useFileUpload
