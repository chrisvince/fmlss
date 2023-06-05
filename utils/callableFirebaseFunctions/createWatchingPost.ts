import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  postPath: string
}

type CreateWatchingPost = (data: Input) => Promise<{ data: void }>

export const createWatchingPost: CreateWatchingPost = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('watchingPost-create')(data)
}
