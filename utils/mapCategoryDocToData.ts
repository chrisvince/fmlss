import type { CategoryData, FirebaseDoc } from '../types'

type MapCategoryDocToData = (postDoc: FirebaseDoc) => CategoryData

const mapCategoryDocToData: MapCategoryDocToData = doc => {
  const data = doc.data()!
  return {
    createdAt: data.createdAt.toMillis() as string,
    name: data.name as string,
    slug: data.slug as string,
    id: doc.id as string,
    updatedAt: data.updatedAt.toMillis() as string,
    postCount: data.postCount as number,
  }
}

export default mapCategoryDocToData
