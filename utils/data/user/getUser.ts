import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from 'memory-cache'

import { User, UserData } from '../../../types'
import { createUserCacheKey } from '../../createCacheKeys'
import isServer from '../../isServer'
import constants from '../../../constants'
import mapUserDocToData from '../../mapUserDocToData'

const { USER_CACHE_TIME, USERS_COLLECTION } = constants

type GetUser = (
  uid: string | undefined | null,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  }
) => Promise<User | null>

const getUser: GetUser = async (uid, { db: dbProp } = {}) => {
  if (!uid) return null

  const db = dbProp || firebase.firestore()

  let doc:
    | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
    | null

  let data: UserData

  const userCacheKey = createUserCacheKey(uid)
  const cachedPostData = get(userCacheKey)

  if (isServer && cachedPostData) {
    data = cachedPostData
    doc = null
  } else {
    const fetchedDoc = await db.collection(USERS_COLLECTION).doc(uid).get()

    if (!fetchedDoc.exists) return null

    doc = fetchedDoc
    data = mapUserDocToData(doc)
    put(userCacheKey, data, USER_CACHE_TIME)
  }

  return {
    data,
    doc: !isServer ? doc : null,
  }
}

export default getUser
