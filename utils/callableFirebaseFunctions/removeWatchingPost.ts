import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  slug: string
}

type RemoveWatchingPost = (data: Input) => Promise<{ data: void }>

export const removeWatchingPost: RemoveWatchingPost = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('watchingPost-remove')(data)
}
