import { useUser } from 'next-firebase-auth'
import { createHasUnreadNotificationsCacheKey } from '../../createCacheKeys'
import getNotifications from './getNotifications'
import useSWR, { SWRConfiguration } from 'swr'
import { useState } from 'react'

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateOnMount: true,
  refreshInterval: 1000 * 60 * 5, // 5 minutes
}

type UseHasUnreadNotifications = (options?: {
  swrConfig?: SWRConfiguration
}) => {
  clear: () => void
  error: unknown
  hasUnreadNotifications: boolean
  isLoading: boolean
  isValidating: boolean
}

const useHasUnreadNotifications: UseHasUnreadNotifications = ({
  swrConfig,
} = {}) => {
  const [cleared, setCleared] = useState(false)
  const { id: uid } = useUser()

  const { data, error, isLoading, isValidating } = useSWR(
    uid ? createHasUnreadNotificationsCacheKey(uid) : null,
    async () => {
      const notifications = await getNotifications(uid!, {
        limit: 1,
        unreadOnly: true,
      })

      return notifications.length > 0
    },
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
      onSuccess: () => {
        setCleared(false)
      },
    }
  )

  const handleClear = () => {
    setCleared(true)
  }

  return {
    clear: handleClear,
    error,
    hasUnreadNotifications: cleared ? false : data ?? false,
    isLoading,
    isValidating,
  }
}

export default useHasUnreadNotifications
