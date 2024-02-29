import type { FirebaseDoc, HashtagData, HashtagDataRequest } from '../types'

type MapHashtagDocToData = (postDoc: FirebaseDoc) => HashtagData

const mapHashtagDocToData: MapHashtagDocToData = doc => {
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
