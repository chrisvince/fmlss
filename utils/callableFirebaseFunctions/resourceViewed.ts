import { getFunctions, httpsCallable } from 'firebase/functions'

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

export const resourceViewed = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'event-resourceViewed')(data)
}
