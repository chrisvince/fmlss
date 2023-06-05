import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'
import constants from '../../../constants'
import { createUserIsWatchingCacheKey } from '../../createCacheKeys'
import isServer from '../../isServer'

const { USER_IS_WATCHING_CACHE_TIME, WATCHERS_COLLECTION } = constants

const checkUserIsWatching = async (
  slug: string,
  documentPath: string,
  uid: string,
  {
    db: dbProp,
  }: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  } = {}
) => {
  const db = dbProp || firebase.firestore()
  let userIsWatching = false
  const userIsWatchingCacheKey = createUserIsWatchingCacheKey(slug, uid)
  const cachedUserIsWatching = get(userIsWatchingCacheKey) as boolean | null

  if (isServer && cachedUserIsWatching !== null) {
    userIsWatching = cachedUserIsWatching
  } else {
    const postWatchersSnapshot = await db
      .collection(`${documentPath}/${WATCHERS_COLLECTION}`)
      .where('uid', '==', uid)
      .limit(1)
      .get()

    if (postWatchersSnapshot.empty) {
      userIsWatching = false
    } else {
      userIsWatching = true
    }

    put(userIsWatchingCacheKey, userIsWatching, USER_IS_WATCHING_CACHE_TIME)
  }

  return userIsWatching
}

export default checkUserIsWatching
