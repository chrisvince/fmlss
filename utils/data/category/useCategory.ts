import useSWR, { KeyedMutator } from 'swr'

import { Category } from '../../../types'
import { createCategoryCacheKey } from '../../createCacheKeys'
import getCategory from './getCategory'

type UseCategory = (
  slug: string,
) => {
  category: Category
  isLoading: boolean
  error: any
  isValidating: boolean
  mutate: KeyedMutator<Category>
}

const useCategory: UseCategory = slug => {
  const categoryCacheKey = createCategoryCacheKey(slug)

  const { data, error, isValidating, mutate } = useSWR(
    categoryCacheKey,
    () => getCategory(slug),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    category: data as Category,
    isLoading: !error && !data,
    isValidating,
    error,
    mutate: mutate as KeyedMutator<Category>,
  }
}

export default useCategory
