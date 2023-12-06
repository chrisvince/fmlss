import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  slug: string
}

type RemoveWatchedPost = (data: Input) => Promise<{ data: void }>

export const removeWatchedPost: RemoveWatchedPost = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('watchedPost-remove')(data)
}
