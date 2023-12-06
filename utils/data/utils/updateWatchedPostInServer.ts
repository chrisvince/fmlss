import {
  createWatchedPost,
  removeWatchedPost,
} from '../../callableFirebaseFunctions'

const updateWatchedPostInServer = async (
  userIsWatchingPost: boolean,
  slug: string
) => {
  if (userIsWatchingPost) {
    await removeWatchedPost({ slug })
    return
  }
  await createWatchedPost({ slug })
}

export default updateWatchedPostInServer
