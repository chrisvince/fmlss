import firebase from 'firebase/app'
import 'firebase/functions'

const functions = firebase.functions()

interface Input {
  slug: string
}

export const createPostLike = functions.httpsCallable('createPostLike') as (
  data: Input
) => Promise<{ data: void }>
