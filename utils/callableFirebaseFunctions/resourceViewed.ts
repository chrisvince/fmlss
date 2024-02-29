import firebase from 'firebase/app'
import 'firebase/functions'

export enum ResourceType {
  Hashtag = 'hashtag',
  Person = 'person',
  Post = 'post',
  Topic = 'topic',
}

interface Input {
  resourceType: ResourceType
  slug: string
}

type ResourceViewed = (data: Input) => Promise<{ data: void }>

export const resourceViewed: ResourceViewed = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('userEvent-resourceViewed')(data)
}
