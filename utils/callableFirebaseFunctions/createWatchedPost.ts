import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  slug: string
}

type CreateWatchedPost = (data: Input) => Promise<{ data: void }>

export const createWatchedPost: CreateWatchedPost = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('watchedPost-create')(data)
}
