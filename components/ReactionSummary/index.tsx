import { Tooltip, Typography } from '@mui/material'
import { ReactionId } from '../../types/Reaction'
import reactions from '../../data/reactions'

export enum PostReaction {
  Adult,
  Angry,
  Funny,
  Interesting,
  Love,
  Offended,
  Sad,
}

const SERIOUS_REACTIONS = [
  ReactionId.AdultContent,
  ReactionId.Angry,
  ReactionId.Offensive,
  ReactionId.Sad,
]

const DESCRIPTION_SUFFIXES: Record<ReactionId, string> = {
  [ReactionId.AdultContent]: 'saw this as adult content',
  [ReactionId.Amazed]: 'were amazed by this',
  [ReactionId.Angry]: 'were angered by this',
  [ReactionId.Funny]: 'found this funny',
  [ReactionId.Interesting]: 'found this interesting',
  [ReactionId.Love]: 'loved this',
  [ReactionId.Offensive]: 'found this offensive',
  [ReactionId.Sad]: 'were saddened by this',
}

const REACTION_THRESHOLD_PERCENTAGES: Record<
  ReactionId,
  {
    error: number | null
    warning: number
  }
> = {
  [ReactionId.AdultContent]: {
    error: 0.15,
    warning: 0.05,
  },
  [ReactionId.Amazed]: {
    error: null,
    warning: 0.5,
  },
  [ReactionId.Angry]: {
    error: 0.75,
    warning: 0.5,
  },
  [ReactionId.Funny]: {
    error: null,
    warning: 0.5,
  },
  [ReactionId.Interesting]: {
    error: null,
    warning: 0.5,
  },
  [ReactionId.Love]: {
    error: null,
    warning: 0.5,
  },
  [ReactionId.Offensive]: {
    error: 0.75,
    warning: 0.5,
  },
  [ReactionId.Sad]: {
    error: 0.75,
    warning: 0.5,
  },
}

const findReaction = (reactionId: ReactionId) =>
  reactions.find(reaction => reaction.id === reactionId)

interface Props {
  percentage: number
  reactionId: ReactionId
}

const ReactionSummary = ({ percentage, reactionId }: Props) => {
  const reaction = findReaction(reactionId)
  if (!reaction) return null
  const warningThreshold = REACTION_THRESHOLD_PERCENTAGES[reactionId].warning
  const errorThreshold = REACTION_THRESHOLD_PERCENTAGES[reactionId].error
  const displayPercentage = `${Math.round(percentage * 100)}%`
  return (
    <Tooltip
      placement="bottom"
      title={`${displayPercentage} of people ${DESCRIPTION_SUFFIXES[reactionId]}`}
    >
      <Typography variant="caption">
        {reaction.emoji}&ensp;
        <Typography
          component="span"
          sx={
            warningThreshold && percentage > warningThreshold
              ? {
                  color: SERIOUS_REACTIONS.includes(reactionId)
                    ? errorThreshold && percentage > errorThreshold
                      ? 'error.main'
                      : 'warning.main'
                    : undefined,
                  fontWeight: 'bold',
                }
              : {}
          }
          variant="caption"
        >
          {displayPercentage}
        </Typography>
      </Typography>
    </Tooltip>
  )
}

export default ReactionSummary
