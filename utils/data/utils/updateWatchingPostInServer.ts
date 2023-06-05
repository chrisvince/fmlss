import {
  createWatchingPost,
  removeWatchingPost,
} from '../../callableFirebaseFunctions'

const updateWatchingPostInServer = async (
  userIsWatchingPost: boolean,
  postPath: string
) => {
  if (userIsWatchingPost) {
    await removeWatchingPost({ postPath })
    return
  }
  await createWatchingPost({ postPath })
}

export default updateWatchingPostInServer
