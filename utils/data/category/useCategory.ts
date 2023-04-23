import useSWR, { SWRConfiguration } from 'swr'

import { Category } from '../../../types'
import { createCategoryCacheKey } from '../../createCacheKeys'
import getCategory from './getCategory'

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnMount: false,
  revalidateOnReconnect: false,
}

type UseCategory = (
  slug: string,
  options?: {
    swrConfig?: SWRConfiguration
  }
) => {
  category: Category | null | undefined
  isLoading: boolean
  error: unknown
  isValidating: boolean
}

const useCategory: UseCategory = (slug, { swrConfig = {} } = {}) => {
  const categoryCacheKey = createCategoryCacheKey(slug)

  const { data, error, isLoading, isValidating } = useSWR(
    categoryCacheKey,
    () => getCategory(slug),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  return {
    category: data,
    error,
    isLoading,
    isValidating,
  }
}

export default useCategory
