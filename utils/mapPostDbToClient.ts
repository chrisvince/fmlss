import type { Post } from '../types'
import { getParentIdFromDbReference } from './dbReferences'

type MapPostDbToClient = (
  postDoc:
    | firebase.default.firestore.QueryDocumentSnapshot<firebase.default.firestore.DocumentData>
    | firebase.default.firestore.DocumentSnapshot<firebase.default.firestore.DocumentData>
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
  createdByUser?: boolean,
) => Post

const mapPostDbToClient: MapPostDbToClient = (
  postDoc,
  createdByUser = false
) => {
  const postData = postDoc.data()
  return {
    body: postData?.body as string,
    createdAt: (postData?.createdAt?.toMillis() ?? null) as string,
    id: postDoc.id as string,
    parentId: getParentIdFromDbReference(postDoc.ref.path) as string,
    reference: postDoc.ref.path as string,
    updatedAt: (postData?.updatedAt?.toMillis() ?? null) as string,
    createdByUser,
    postsCount: postData?.postsCount ?? null as number | null,
  }
}

export default mapPostDbToClient
