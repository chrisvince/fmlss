import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import constants from '../../../constants'
import { createHasUsernameCacheKey } from '../../createCacheKeys'
import isServer from '../../isServer'
import mapUserDocToData from '../../mapUserDocToData'

const { HAS_USERNAME_CACHE_TIME, USERS_COLLECTION } = constants

type CheckIfUserHasUsername = (
  uid: string | undefined | null,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  }
) => Promise<boolean>

const checkIfUserHasUsername: CheckIfUserHasUsername = async (
  uid,
  { db: dbProp } = {}
) => {
  if (!uid) return false
  const db = dbProp || firebase.firestore()
  const cacheKey = createHasUsernameCacheKey(uid)
  const cachedHasUsername = get(cacheKey)

  if (isServer && cachedHasUsername) {
    return cachedHasUsername
  }

  const fetchedDoc = await db.collection(USERS_COLLECTION).doc(uid).get()
  if (!fetchedDoc.exists) return false
  const data = mapUserDocToData(fetchedDoc)
  const hasUsername = !!data.username

  if (hasUsername) {
    put(cacheKey, hasUsername, HAS_USERNAME_CACHE_TIME)
  }

  return hasUsername
}

export default checkIfUserHasUsername
