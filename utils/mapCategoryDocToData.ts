import type { CategoryData, FirebaseDoc } from '../types'

type MapCategoryDocToData = (postDoc: FirebaseDoc) => CategoryData

const mapCategoryDocToData: MapCategoryDocToData = doc => {
  const data = doc.data()!
  return {
    createdAt: data.createdAt.toMillis() as string,
    id: doc.id as string,
    name: data.name as string,
    postCount: data.postCount as number,
    slug: data.slug as string,
    updatedAt: data.updatedAt.toMillis() as string,
    viewCount: data.viewCount as number,
  }
}

export default mapCategoryDocToData
