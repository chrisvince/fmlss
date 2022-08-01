import firebase from 'firebase/app'
import 'firebase/functions'

const functions = firebase.functions()

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

export const createPost = functions.httpsCallable('createPost') as (
  input: Input
) => Promise<Response>
