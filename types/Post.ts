import firebase from 'firebase/app'
import { PostData } from '.'

type firebaseDoc =
  | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
  | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  | FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>

export interface Post {
  createdByUser: boolean
  data: PostData | null
  doc: firebaseDoc | null
  replies: {
    createdByUser: boolean
    data: PostData
    doc: firebaseDoc | null
  }[]
}
