import firebase from 'firebase/app'
import 'firebase/firestore'
import { get, put } from '../../serverCache'

import { createPeopleSearchCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'
import isServer from '../../isServer'
import { PersonData } from '../../../types/PersonData'
import mapPersonDocToData from '../../mapPersonDocToData'
import slugify from '../../slugify'

const { AUTOCOMPLETE_LENGTH, PEOPLE_COLLECTION, PEOPLE_SEARCH_CACHE_TIME } =
  constants

interface Options {
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
}

const getPeopleSearch = async (
  searchString: string,
  { db: dbProp }: Options = {}
) => {
  const db = dbProp || firebase.firestore()
  const slug = slugify(searchString)
  const cacheKey = createPeopleSearchCacheKey(slug)

  let personDocs:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    | null

  let personData: PersonData[] = []
  const serverCachedData = get(cacheKey)

  if (serverCachedData) {
    personData = serverCachedData
    personDocs = null
  } else {
    personDocs = await db
      .collection(PEOPLE_COLLECTION)
      .where('slug', '>=', slug)
      .where('slug', '<=', slug + '\uf8ff')
      .limit(AUTOCOMPLETE_LENGTH)
      .get()

    if (personDocs.empty) return []

    personData = personDocs.docs.map(doc => mapPersonDocToData(doc))
    put(cacheKey, personData, PEOPLE_SEARCH_CACHE_TIME)
  }

  const people = personData.map((data, index) => ({
    data,
    doc: !isServer ? personDocs?.docs[index] ?? null : null,
  }))

  return people
}

export default getPeopleSearch
