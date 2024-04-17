import firebase from 'firebase/app'

import { get, put } from '../../serverCache'
import constants from '../../../constants'
import { createUserIsWatchingCacheKey } from '../../createCacheKeys'
import initFirebaseAdmin from '../../initFirebaseAdmin'

const { USER_IS_WATCHING_CACHE_TIME, WATCHERS_COLLECTION } = constants

const checkUserIsWatchingServer = async (
  slug: string,
  uid: string
): Promise<boolean> => {
  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()

  let userIsWatching = false
  const userIsWatchingCacheKey = createUserIsWatchingCacheKey(slug, uid)
  const cachedUserIsWatching = get(userIsWatchingCacheKey)

  if (cachedUserIsWatching !== null) {
    userIsWatching = cachedUserIsWatching
  } else {
    const postWatchersSnapshot = await db
      .collectionGroup(WATCHERS_COLLECTION)
      .where('uid', '==', uid)
      .where('post.slug', '==', slug)
      .limit(1)
      .get()

    userIsWatching = !postWatchersSnapshot.empty
    put(userIsWatchingCacheKey, userIsWatching, USER_IS_WATCHING_CACHE_TIME)
  }

  return userIsWatching
}

export default checkUserIsWatchingServer
