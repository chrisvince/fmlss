import getTopicsSearch from './getTopicsSearch'
import useSWR from 'swr'

const useTopicSearch = (searchString: string | undefined) => {
  const { data, isLoading } = useSWR(searchString, getTopicsSearch, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  })

  return {
    topics: data ?? [],
    isLoading,
  }
}

export default useTopicSearch
