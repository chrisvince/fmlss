import { useUser } from 'next-firebase-auth'
import useSWR, { SWRConfiguration } from 'swr'
import { User, UserDataInput } from '../../../types'
import { createUserCacheKey } from '../../createCacheKeys'
import getUserData from './getUserData'
import constants from '../../../constants'
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'

const { USERS_COLLECTION } = constants

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
}

type UseUser = (options?: { swrConfig?: SWRConfiguration; skip?: boolean }) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  update: (data: UserDataInput) => Promise<void>
  user: User | null | undefined
}

const useUserData: UseUser = ({ swrConfig = {}, skip = false } = {}) => {
  const { id: uid } = useUser()
  const userCacheKey = uid ? createUserCacheKey(uid) : undefined

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    !skip ? userCacheKey : undefined,
    () => (uid ? getUserData(uid) : null),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  const update = async (data: UserDataInput) => {
    if (!uid) {
      throw new Error('User is not authenticated')
    }

    const db = getFirestore()
    const collectionRef = collection(db, USERS_COLLECTION)
    const dbRef = doc(collectionRef, uid)
    await updateDoc(dbRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })

    await mutate()
  }

  return {
    error,
    isLoading,
    isValidating,
    update,
    user: data,
  }
}

export default useUserData
