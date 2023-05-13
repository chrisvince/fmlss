import type { FirebaseDoc, HashtagData, HashtagDataRequest } from '../types'

type MapHashtagDocToData = (postDoc: FirebaseDoc) => HashtagData

const mapHashtagDocToData: MapHashtagDocToData = doc => {
  const data = doc.data() as HashtagDataRequest
  return {
    createdAt: data.createdAt.toMillis(),
    display: data.display,
    id: doc.id,
    recentViewCount: data.recentViewCount,
    slug: data.slug,
    updatedAt: data.updatedAt.toMillis(),
    usageCount: data.usageCount,
    viewCount: data.viewCount,
  }
}

export default mapHashtagDocToData
