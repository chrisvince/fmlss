import useSWR, { SWRConfiguration } from 'swr'

import { createPersonCacheKey } from '../../createCacheKeys'
import getPerson from './getPerson'
import { Person } from '../../../types/Person'

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
}

type UsePerson = (
  path: string | null,
  options?: {
    swrConfig?: SWRConfiguration
  }
) => {
  person: Person | null | undefined
  isLoading: boolean
  error: unknown
  isValidating: boolean
}

const usePerson: UsePerson = (slug, { swrConfig = {} } = {}) => {
  const personCacheKey = slug ? createPersonCacheKey(slug) : null

  const { data, error, isLoading, isValidating } = useSWR(
    personCacheKey,
    () => getPerson(slug!),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  return {
    person: data,
    error,
    isLoading,
    isValidating,
  }
}

export default usePerson
