import type { FirebaseDoc, HashtagData, HashtagDataRequest } from '../types'

const mapHashtagDocToData = (doc: FirebaseDoc): HashtagData => {
  const data = doc.data() as HashtagDataRequest
  return {
    createdAt: data.createdAt.toMillis(),
    display: data.display,
    id: doc.id,
    popularityScoreAllTime: data.popularityScoreAllTime,
    popularityScoreRecent: data.popularityScoreRecent,
    postCount: data.postCount,
    slug: data.slug,
    updatedAt: data.updatedAt.toMillis(),
    viewCount: data.viewCount,
  }
}

export default mapHashtagDocToData
