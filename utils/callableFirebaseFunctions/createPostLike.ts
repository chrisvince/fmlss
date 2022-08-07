import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  slug: string
}

type CreatePostLike = (data: Input) => Promise<{ data: void }>

export const createPostLike: CreatePostLike = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('postLike-create')(data)
}
