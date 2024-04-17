import type { FirebaseDoc, HashtagData, HashtagDataRequest } from '../types'

const mapHashtagDocToData = (doc: FirebaseDoc): HashtagData => {
  const data = doc.data() as HashtagDataRequest
  return {
    createdAt: data.createdAt.toMillis(),
    display: data.display,
    id: doc.id,
    slug: data.slug,
    updatedAt: data.updatedAt.toMillis(),
    postCount: data.postCount,
    viewCount: data.viewCount,
  }
}

export default mapHashtagDocToData
