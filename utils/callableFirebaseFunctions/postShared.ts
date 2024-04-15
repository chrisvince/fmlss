import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  slug: string
}

type PostShared = (data: Input) => Promise<{ data: void }>

export const postShared: PostShared = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('userEvent-postShared')(data)
}
