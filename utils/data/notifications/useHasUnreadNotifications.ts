import { useAuthUser } from 'next-firebase-auth'
import { createHasUnreadNotificationsCacheKey } from '../../createCacheKeys'
import getNotifications from './getNotifications'
import useSWR, { SWRConfiguration } from 'swr'

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateOnMount: true,
  refreshInterval: 1000 * 60 * 5, // 5 minutes
}

type UseHasUnreadNotifications = (options?: {
  swrConfig?: SWRConfiguration
}) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  hasUnreadNotifications: boolean
}

const useHasUnreadNotifications: UseHasUnreadNotifications = ({
  swrConfig,
} = {}) => {
  const { id: uid } = useAuthUser()

  const { data, error, isLoading, isValidating } = useSWR(
    createHasUnreadNotificationsCacheKey(uid!),
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
    }
  )

  return {
    error,
    isLoading,
    isValidating,
    hasUnreadNotifications: data ?? false,
  }
}

export default useHasUnreadNotifications
