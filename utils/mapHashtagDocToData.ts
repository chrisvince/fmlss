import type { FirebaseDoc, HashtagData } from '../types'

type MapHashtagDocToData = (postDoc: FirebaseDoc) => HashtagData

const mapHashtagDocToData: MapHashtagDocToData = doc => {
  const data = doc.data()
  return {
    hashtag: data?.hashtag as string,
    createdAt: data?.createdAt?.toMillis() as string,
    id: doc.id as string,
    updatedAt: data?.updatedAt?.toMillis() as string,
  }
}

export default mapHashtagDocToData
