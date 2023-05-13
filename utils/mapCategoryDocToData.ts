import type { CategoryData, CategoryDataRequest, FirebaseDoc } from '../types'

type MapCategoryDocToData = (postDoc: FirebaseDoc) => CategoryData

const mapCategoryDocToData: MapCategoryDocToData = doc => {
  const data = doc.data() as CategoryDataRequest
  return {
    createdAt: data.createdAt.toMillis(),
    id: doc.id,
    name: data.name,
    postCount: data.postCount,
    recentViewCount: data.recentViewCount,
    slug: data.slug,
    updatedAt: data.updatedAt.toMillis(),
    viewCount: data.viewCount,
  }
}

export default mapCategoryDocToData
