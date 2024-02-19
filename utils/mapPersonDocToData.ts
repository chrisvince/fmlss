import type { FirebaseDoc } from '../types'
import { PersonData } from '../types/PersonData'
import { PersonDataRequest } from '../types/PersonDataRequest'

const mapPersonDocToData = (personDoc: FirebaseDoc): PersonData => {
  const personData = personDoc.data() as PersonDataRequest

  return {
    createdAt: personData.createdAt.toMillis(),
    id: personDoc.id,
    name: personData.name,
    postCount: personData.postCount,
    slug: personData.slug,
    updatedAt: personData.updatedAt.toMillis(),
  }
}

export default mapPersonDocToData
