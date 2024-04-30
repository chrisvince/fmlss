import type { FirebaseDoc, Like, LikeRequest } from '../types'
import mapPostRelation from './mapPostRelation'

const mapLikeDocToData = (likeDoc: FirebaseDoc): Like => {
  const postData = likeDoc.data() as LikeRequest

  return {
    createdAt: postData.createdAt.toMillis(),
    post: mapPostRelation(postData.post),
    uid: postData.uid,
    updatedAt: postData.updatedAt.toMillis(),
  }
}

export default mapLikeDocToData
