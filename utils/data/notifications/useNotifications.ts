import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { createNotificationsSWRGetKey } from '../../createCacheKeys'
import constants from '../../../constants'
import getNotifications from './getNotifications'
import { Notification } from '../../../types'
import { useEffect, useMemo, useRef } from 'react'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import useAuth from '../../auth/useAuth'

const {
  NOTIFICATION_PAGINATION_COUNT,
  NOTIFICATIONS_COLLECTION,
  USERS_COLLECTION,
} = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  initialSize: 1,
  parallel: true,
  revalidateAll: true,
  revalidateFirstPage: true,
  revalidateOnFocus: true,
  revalidateOnMount: true,
}

type UseNotifications = (options?: {
  limit?: number
  markRead?: boolean
  skip?: boolean
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Notification[]>
  moreToLoad: boolean
  notifications: Notification[]
}

const useNotifications: UseNotifications = ({
  limit = NOTIFICATION_PAGINATION_COUNT,
  markRead = true,
  skip = false,
  swrConfig,
} = {}) => {
  const db = getFirestore()
  const markedReadTraceRef = useRef<string[]>([])
  const { uid } = useAuth() ?? {}

  const {
    data: pages,
    error,
    isLoading,
    isValidating,
    mutate,
    setSize,
    size,
  } = useSWRInfinite(
    createNotificationsSWRGetKey({ skip, uid }),
    ({ startAfter }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return getNotifications(uid!, {
        startAfter,
        limit,
      })
    },
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  const moreToLoad = pages?.at?.(-1)?.length === NOTIFICATION_PAGINATION_COUNT
  const notifications = useMemo(() => pages?.flat() ?? [], [pages])

  const loadMore = async () => {
    if (!moreToLoad) return pages?.flat() ?? []
    const newData = await setSize(size + 1)
    return newData?.flat() ?? []
  }

  useEffect(() => {
    if (!markRead) return

    const unreadNotifications = notifications.filter(
      ({ data }) =>
        !data.readAt && !markedReadTraceRef.current.includes(data.id)
    )

    if (!unreadNotifications.length) return

    unreadNotifications.forEach(({ data }) => {
      const docRef = doc(
        db,
        `${USERS_COLLECTION}/${uid}/${NOTIFICATIONS_COLLECTION}/${data.id}`
      )
      updateDoc(docRef, { readAt: new Date() })
      markedReadTraceRef.current.push(data.id)
    })
  }, [db, markRead, notifications, uid])

  return {
    error,
    isLoading,
    isValidating,
    loadMore,
    moreToLoad,
    mutate,
    notifications,
  }
}

export default useNotifications
