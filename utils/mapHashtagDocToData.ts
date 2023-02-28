import type { FirebaseDoc, HashtagData } from '../types'

type MapHashtagDocToData = (postDoc: FirebaseDoc) => HashtagData

const mapHashtagDocToData: MapHashtagDocToData = doc => {
  const data = doc.data()!
  return {
    createdAt: data.createdAt.toMillis() as string,
    display: data.display as string,
    id: doc.id as string,
    recentViewCount: data.recentViewCount as number,
    slug: data.slug as string,
    updatedAt: data.updatedAt.toMillis() as string,
    usageCount: data.usageCount as number,
    viewCount: data.viewCount as number,
  }
}

export default mapHashtagDocToData
