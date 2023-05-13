import { createPostLike, removePostLike } from '../../callableFirebaseFunctions'

const updatePostLikeInServer = async (userLikesPost: boolean, slug: string) => {
  if (userLikesPost) {
    await removePostLike({ slug })
    return
  }
  await createPostLike({ slug })
}

export default updatePostLikeInServer
