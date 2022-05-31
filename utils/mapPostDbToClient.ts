import type { Post } from '../types'
import { getParentIdFromDbReference } from './dbReferences'

type MapPostDbToClient = (
  postDoc:
    | firebase.default.firestore.QueryDocumentSnapshot<firebase.default.firestore.DocumentData>
    | firebase.default.firestore.DocumentSnapshot<firebase.default.firestore.DocumentData>,
  replyDocs?: firebase.default.firestore.QueryDocumentSnapshot<firebase.default.firestore.DocumentData>[] | firebase.default.firestore.DocumentSnapshot<firebase.default.firestore.DocumentData>[]
) => Post

const mapPostDbToClient: MapPostDbToClient = (postDoc, replyDocs) => {
  const postData = postDoc.data()
  return {
    body: postData?.body as string,
    createdAt: (postData?.createdAt?.toMillis() ?? null) as string,
    id: postDoc.id as string,
    parentId: getParentIdFromDbReference(postDoc.ref.path) as string,
    reference: postDoc.ref.path as string,
    updatedAt: (postData?.updatedAt?.toMillis() ?? null) as string,
    posts: (replyDocs?.map((doc) => mapPostDbToClient(doc)) ?? null) as Post[],
    postsCount: postData?.postsCount ?? null as number | null,
  }
}

export default mapPostDbToClient
