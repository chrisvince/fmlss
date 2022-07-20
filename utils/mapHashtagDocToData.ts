import type { FirebaseDoc, HashtagData } from '../types'

type MapHashtagDocToData = (postDoc: FirebaseDoc) => HashtagData

const mapHashtagDocToData: MapHashtagDocToData = doc => {
  const data = doc.data()!
  return {
    createdAt: data.createdAt.toMillis() as string,
    hashtag: data.hashtag as string,
    id: doc.id as string,
    updatedAt: data.updatedAt.toMillis() as string,
    usageCount: data.usageCount as number,
    viewCount: data.viewCount as number,
  }
}

export default mapHashtagDocToData
