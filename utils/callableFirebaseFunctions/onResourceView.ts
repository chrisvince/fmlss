import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  resource: 'post' | 'category' | 'hashtag'
  slug: string
}

type ForgotPassword = (data: Input) => Promise<{ data: void }>

export const onResourceView: ForgotPassword = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('resource-onView')(data)
}
