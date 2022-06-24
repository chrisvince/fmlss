import firebase from 'firebase/app'

import type { PostData } from '../types'
import { getParentIdFromDbReference } from './dbReferences'

type MapPostDbToClient = (
  postDoc:
    | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
    | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
) => PostData

const mapPostDocToData: MapPostDbToClient = postDoc => {
  const postData = postDoc.data()
  return {
    body: postData?.body as string,
    createdAt: postData?.createdAt?.toMillis() as string,
    id: postDoc.id as string,
    likesCount: postData?.likesCount ?? 0 as number,
    parentId: getParentIdFromDbReference(postDoc.ref.path) as string,
    postsCount: postData?.postsCount ?? 0 as number,
    reference: postDoc.ref.path as string,
    slug: postData?.slug as string,
    updatedAt: postData?.updatedAt?.toMillis() as string,
  }
}

export default mapPostDocToData
