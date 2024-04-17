import { QueryDocumentSnapshot } from 'firebase/firestore'

export type FirebaseDoc =
  | QueryDocumentSnapshot<unknown>
  | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
  | FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
