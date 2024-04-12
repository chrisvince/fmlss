import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from '../../serverCache'
import constants from '../../../constants'
import { createUserIsWatchingCacheKey } from '../../createCacheKeys'

const { USER_IS_WATCHING_CACHE_TIME, WATCHERS_COLLECTION } = constants

const checkUserIsWatching = async (
  slug: string,
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

  const serverCachedUserIsWatching = get(userIsWatchingCacheKey) as
    | boolean
    | null

  if (serverCachedUserIsWatching !== null) {
    userIsWatching = serverCachedUserIsWatching
  } else {
    const postWatchersSnapshot = await db
      .collectionGroup(WATCHERS_COLLECTION)
      .where('uid', '==', uid)
      .where('slug', '==', slug)
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
