import useSWR from 'swr'
import getTiktokAttachment from './getTiktokAttachment'

const useTiktokAttachment = (url: string | null) => {
  const { data, error, isLoading } = useSWR(url, getTiktokAttachment, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return {
    data,
    error,
    isLoading,
  }
}

export default useTiktokAttachment
