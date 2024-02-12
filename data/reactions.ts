import { ReactionOptions, ReactionId } from '../types/Reaction'

const reactions: ReactionOptions[] = [
  {
    emoji: '😍',
    id: ReactionId.Love,
    text: 'Love',
  },
  {
    emoji: '😂',
    id: ReactionId.Funny,
    text: 'Funny',
  },
  {
    emoji: '😮',
    id: ReactionId.Amazed,
    text: 'Amazed',
  },
  {
    emoji: '🤔',
    id: ReactionId.Interesting,
    text: 'Interesting',
  },
  {
    emoji: '😢',
    id: ReactionId.Sad,
    text: 'Sad',
  },
  {
    emoji: '😡',
    id: ReactionId.Angry,
    text: 'Angry',
  },
  {
    emoji: '😧',
    id: ReactionId.Offensive,
    text: 'Offensive',
  },
  {
    emoji: '🔞',
    id: ReactionId.AdultContent,
    text: 'Adult content',
  },
]

export default reactions
