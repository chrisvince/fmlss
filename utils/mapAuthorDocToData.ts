import type { Author, AuthorRequest, FirebaseDoc } from '../types'
import mapPostRelation from './mapPostRelation'

const mapAuthorDocToData = (likeDoc: FirebaseDoc): Author => {
  const postData = likeDoc.data() as AuthorRequest

  return {
    createdAt: postData.createdAt.toMillis(),
    post: mapPostRelation(postData.post),
    uid: postData.uid,
    updatedAt: postData.updatedAt.toMillis(),
  }
}

export default mapAuthorDocToData
