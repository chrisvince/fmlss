import firebase from 'firebase/app'

export type FirebaseDoc =
  | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
  | firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  | FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
