import { get, put } from '../../serverCache'

import { User, UserData } from '../../../types'
import { createUserCacheKey } from '../../createCacheKeys'
import isServer from '../../isServer'
import constants from '../../../constants'
import mapUserDocToData from '../../mapUserDocToData'
import initFirebaseAdmin from '../../initFirebaseAdmin'

const { USER_CACHE_TIME, USERS_COLLECTION } = constants

const getUserDataServer = async (uid: string): Promise<User | null> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  let data: UserData
  const userCacheKey = createUserCacheKey(uid)
  const cachedPostData = get(userCacheKey)

  if (cachedPostData) {
    data = cachedPostData
  } else {
    const fetchedDoc = await db.collection(USERS_COLLECTION).doc(uid).get()
    if (!fetchedDoc.exists) return null
    data = mapUserDocToData(fetchedDoc)
    put(userCacheKey, data, USER_CACHE_TIME)
  }

  return { data }
}

export default getUserDataServer
