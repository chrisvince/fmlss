import firebase from 'firebase/app'
import 'firebase/functions'

const functions = firebase.functions()

interface Input {
  body: string
  replyingToReference?: string
}

export const createPost = functions.httpsCallable('createPost') as (
  input: Input
) => Promise<{
  data: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
}>
