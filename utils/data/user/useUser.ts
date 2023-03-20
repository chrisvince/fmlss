import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuthUser } from 'next-firebase-auth'
import useSWR, { SWRConfiguration } from 'swr'
import { User, UserData, UserDataInput } from '../../../types'
import { createUserCacheKey } from '../../createCacheKeys'
import getUser from './getUser'
import constants from '../../../constants'
import { useState } from 'react'

const { USERS_COLLECTION } = constants

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
}

type UseUser = (options?: { swrConfig?: SWRConfiguration }) => {
  error: any
  isLoading: boolean
  isValidating: boolean
  update: (data: UserDataInput) => Promise<void>
  user: User | null | undefined
}

const useUser: UseUser = ({ swrConfig = {} } = {}) => {
  const [updateIsLoading, setUpdateIsLoading] = useState(false)
  const { id: uid } = useAuthUser()
  const userCacheKey = createUserCacheKey(uid)

  const { data, error, isValidating, mutate } = useSWR(
    userCacheKey,
    () => getUser(uid),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  const update = async (data: UserDataInput) => {
    if (!uid) {
      throw new Error('User is not authenticated')
    }

    const db = firebase.firestore()
    setUpdateIsLoading(true)

    await db
      .collection(USERS_COLLECTION)
      .doc(uid)
      .update({
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })

    await mutate()
    setUpdateIsLoading(false)
  }

  return {
    error,
    isLoading: (!error && !data) || updateIsLoading,
    isValidating,
    update,
    user: data,
  }
}

export default useUser
