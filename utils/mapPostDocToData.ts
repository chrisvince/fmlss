import firebase from 'firebase/app'

import type { PostData } from '../types'
import { getParentIdFromDbReference } from './dbReferences'

type MapPostDbToClient = (
  postDoc:
    | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
  createdByUser?: boolean,
) => PostData

const mapPostDocToData: MapPostDbToClient = postDoc => {
  const postData = postDoc.data()
  return {
    body: postData?.body as string,
    createdAt: (postData?.createdAt?.toMillis() ?? null) as string,
    id: postDoc.id as string,
    parentId: getParentIdFromDbReference(postDoc.ref.path) as string,
    postsCount: postData?.postsCount ?? null as number | null,
    reference: postDoc.ref.path as string,
    slug: postData?.slug as string,
    updatedAt: (postData?.updatedAt?.toMillis() ?? null) as string,
  }
}

export default mapPostDocToData
