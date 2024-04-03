import firebase from 'firebase/app'
import 'firebase/storage'
import { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import getImageDimensionsFromUrl from '../../getImageDimensionsFromUrl'
import { MediaItem } from '../../../types/MediaItem'

interface Options {
  onFileUploaded?: (mediaItem: MediaItem) => void
}

const useFileUpload = ({ onFileUploaded }: Options = {}) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  const upload = (file: File) => {
    const mediaId = uuidV4()
    const storageRef = firebase.storage().ref()
    const fileRef = storageRef.child(`post-assets/post/${mediaId}`)
    const uploadTask = fileRef.put(file)
    setUploadInProgress(true)
    setIsError(false)

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
        setIsError(true)
      },
      async () => {
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL()
        const dimensions = await getImageDimensionsFromUrl(downloadURL)

        await fileRef.updateMetadata({
          customMetadata: {
            height: `${dimensions.height}`,
            width: `${dimensions.width}`,
          },
        })

        onFileUploaded?.({
          height: dimensions.height,
          id: mediaId,
          url: downloadURL,
          width: dimensions.width,
        })

        setUploadProgress(0)
        setUploadInProgress(false)
      }
    )
  }

  return {
    isError,
    upload,
    uploadInProgress,
    uploadProgress,
  }
}

export default useFileUpload
