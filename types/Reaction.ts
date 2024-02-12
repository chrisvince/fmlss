export enum ReactionId {
  AdultContent = 'adult-content',
  Amazed = 'amazed',
  Angry = 'angry',
  Funny = 'funny',
  Interesting = 'interesting',
  Love = 'love',
  Offensive = 'offensive',
  Sad = 'sad',
}

export type ReactionOptions = {
  emoji: string
  id: ReactionId
  text: string
}

export interface PostReaction {
  createdAt: string
  reaction: ReactionId
  slug: string
  uid: string
  updatedAt: string
}

export interface MajorityReaction {
  id: ReactionId
  percentage: number
}
