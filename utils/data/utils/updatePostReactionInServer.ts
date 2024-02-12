import { ReactionId } from '../../../types/Reaction'
import { updatePostReaction } from '../../callableFirebaseFunctions'

const updatePostReactionInServer = async (
  reaction: ReactionId | undefined,
  slug: string
) => {
  await updatePostReaction({ reaction, slug })
}

export default updatePostReactionInServer
