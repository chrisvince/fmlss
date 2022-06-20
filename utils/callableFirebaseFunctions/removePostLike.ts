import firebase from 'firebase/app'
import 'firebase/functions'

const functions = firebase.functions()

interface Input {
  slug: string
}

export const removePostLike = functions.httpsCallable('removePostLike') as (
  data: Input
) => Promise<{ data: void }>
