import {
  createWatchingPost,
  removeWatchingPost,
} from '../../callableFirebaseFunctions'

const updateWatchingPostInServer = async (
  userIsWatchingPost: boolean,
  slug: string
) => {
  if (userIsWatchingPost) {
    await removeWatchingPost({ slug })
    return
  }
  await createWatchingPost({ slug })
}

export default updateWatchingPostInServer
