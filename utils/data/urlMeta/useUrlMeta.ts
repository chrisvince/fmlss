import useSWR, { SWRConfiguration } from 'swr'
import getUrlMetaClient from './getUrlMetaClient'

const useUrlMeta = (
  url: string | null | undefined,
  swrConfig: SWRConfiguration = {}
) => {
  const { data, error, isLoading } = useSWR(url, getUrlMetaClient, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...swrConfig,
  })

  return {
    data,
    error,
    isLoading,
  }
}

export default useUrlMeta
