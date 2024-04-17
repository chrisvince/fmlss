import { get, put } from '../../serverCache'
import constants from '../../../constants'
import { createPersonCacheKey } from '../../createCacheKeys'
import isServer from '../../isServer'
import { PersonData } from '../../../types/PersonData'
import mapPersonDocToData from '../../mapPersonDocToData'
import { Person } from '../../../types/Person'
import initFirebaseAdmin from '../../initFirebaseAdmin'

const { PEOPLE_COLLECTION, PERSON_CACHE_TIME } = constants

const getPersonServer = async (slug: string): Promise<Person | null> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()

  let doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData> | null
  let data: PersonData

  const personCacheKey = createPersonCacheKey(slug)
  const cachedData = get(personCacheKey)

  if (cachedData) {
    data = cachedData
    doc = null
  } else {
    const peopleRef = await db
      .collection(PEOPLE_COLLECTION)
      .where('slug', '==', slug)
      .limit(1)
      .get()

    if (peopleRef.empty) {
      return null
    }

    doc = peopleRef.docs[0]
    data = mapPersonDocToData(doc)
    put(personCacheKey, data, PERSON_CACHE_TIME)
  }

  return { data }
}

export default getPersonServer
