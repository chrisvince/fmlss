import useSWR from 'swr'
import getTwitterAttachmentClient from './getTwitterAttachmentClient'

const usePostBodyAttachmentTwitter = (url: string | null) => {
  const { data, error, isLoading } = useSWR(url, getTwitterAttachmentClient, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return {
    data,
    error,
    isLoading,
  }
}

export default usePostBodyAttachmentTwitter
