import { PersonData } from '../types/PersonData'
import { PersonDataRequest } from '../types/PersonDataRequest'
import { FirebaseDoc } from '../types'

const mapPersonDocToData = (doc: FirebaseDoc): PersonData => {
  const personData = doc.data() as PersonDataRequest

  return {
    createdAt: personData.createdAt.toMillis(),
    id: doc.id,
    name: personData.name,
    popularityScoreAllTime: personData.popularityScoreAllTime,
    popularityScoreRecent: personData.popularityScoreRecent,
    postCount: personData.postCount,
    slug: personData.slug,
    updatedAt: personData.updatedAt.toMillis(),
  }
}

export default mapPersonDocToData
