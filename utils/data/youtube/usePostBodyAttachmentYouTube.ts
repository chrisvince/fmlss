import useSWR from 'swr'
import getYouTubeAttachmentClient from './getYouTubeAttachmentClient'

const usePostBodyAttachmentYouTube = (url: string | null) => {
  const { data, error, isLoading } = useSWR(url, getYouTubeAttachmentClient, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return {
    data,
    error,
    isLoading,
  }
}

export default usePostBodyAttachmentYouTube
