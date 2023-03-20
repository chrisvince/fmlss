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
  error: any
  isValidating: boolean
}

const useCategory: UseCategory = (slug, { swrConfig = {} } = {}) => {
  const categoryCacheKey = createCategoryCacheKey(slug)

  const { data, error, isValidating } = useSWR(
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
    isLoading: !error && !data,
    isValidating,
  }
}

export default useCategory
