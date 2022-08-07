import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  slug: string
}

type RemovePostLike = (data: Input) => Promise<{ data: void }>

export const removePostLike: RemovePostLike = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('postLike-remove')(data)
}
