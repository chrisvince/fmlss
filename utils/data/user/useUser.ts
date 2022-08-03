import firebase from 'firebase/app'
import 'firebase/firestore'
import { useAuthUser } from 'next-firebase-auth'
import useSWR, { KeyedMutator } from 'swr'
import { FetcherResponse, PublicConfiguration } from 'swr/dist/types'
import { User, UserData, UserDataInput } from '../../../types'
import { createUserCacheKey } from '../../createCacheKeys'
import getUser from './getUser'
import constants from '../../../constants'
import { useState } from 'react'

const { USERS_COLLECTION } = constants

type SWRConfig = Partial<
  PublicConfiguration<
    User | null,
    any,
    (args_0: string) => FetcherResponse<User | null>
  >
>

const DEFAULT_SWR_CONFIG: SWRConfig = {
  revalidateOnFocus: false,
}

type UseUser = (options?: { swrConfig?: SWRConfig }) => {
  error: any
  isLoading: boolean
  isValidating: boolean
  mutate: KeyedMutator<User>
  update: (data: UserDataInput) => Promise<void>
  user: User | null | undefined
}

const db = firebase.firestore()

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
    
    setUpdateIsLoading(true)

    await db.collection(USERS_COLLECTION).doc(uid).update({
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
    mutate: mutate as KeyedMutator<User>,
    update,
    user: data,
  }
}

export default useUser
