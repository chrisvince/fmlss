import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  body: string
  category?: string | null
  replyingToReference?: string
}

type Response = {
  data: {
    id: string
    slug: string
  }
}

type CreatePost = (data: Input) => Promise<Response>

export const createPost: CreatePost = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('createPost')(data)
}
