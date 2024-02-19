import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from '../../serverCache'

import constants from '../../../constants'
import { createPersonCacheKey } from '../../createCacheKeys'
import isServer from '../../isServer'
import { PersonData } from '../../../types/PersonData'
import mapPersonDocToData from '../../mapPersonDocToData'
import { Person } from '../../../types/Person'

const { PEOPLE_COLLECTION, PERSON_CACHE_TIME } = constants

type GetPerson = (
  slug: string,
  options?: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  }
) => Promise<Person | null>

const getPerson: GetPerson = async (slug, { db: dbProp } = {}) => {
  const db = dbProp || firebase.firestore()

  let doc:
    | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | null

  let data: PersonData

  const personCacheKey = createPersonCacheKey(slug)
  const serverCachedData = get(personCacheKey)

  if (serverCachedData) {
    data = serverCachedData
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

  return {
    data,
    doc: !isServer ? doc : null,
  }
}

export default getPerson
