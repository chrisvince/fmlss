import {
  PostAttachment,
  PostAttachmentDb,
  PostAttachmentType,
} from '../../../types'
import isServer from '../../isServer'
import getTiktokAttachment from '../tiktok/getTiktokAttachment'
import getTwitterAttachmentClient from '../twitter/getTwitterAttachmentClient'
import getTwitterAttachmentServer from '../twitter/getTwitterAttachmentServer'
import getUrlMetaClient from '../urlMeta/getUrlMetaClient'
import getUrlMetaServer from '../urlMeta/getUrlMetaServer'
import getYouTubeAttachmentClient from '../youtube/getYouTubeAttachmentClient'
import getYouTubeAttachmentServer from '../youtube/getYouTubeAttachmentServer'

const getPostAttachment = async (
  postAttachmentDb: PostAttachmentDb
): Promise<PostAttachment> => {
  if (postAttachmentDb.type === PostAttachmentType.Url) {
    if (isServer) {
      const postAttachmentUrl = await getUrlMetaServer(postAttachmentDb.href)
      return postAttachmentUrl
    }

    const postAttachmentUrl = await getUrlMetaClient(postAttachmentDb.href)
    return postAttachmentUrl
  }

  if (postAttachmentDb.type === PostAttachmentType.Tiktok) {
    const tiktokAttachment = await getTiktokAttachment(postAttachmentDb.href)
    return tiktokAttachment
  }

  if (postAttachmentDb.type === PostAttachmentType.Twitter) {
    if (isServer) {
      const twitterAttachment = await getTwitterAttachmentServer(
        postAttachmentDb.href
      )
      return twitterAttachment
    }

    const twitterAttachment = await getTwitterAttachmentClient(
      postAttachmentDb.href
    )
    return twitterAttachment
  }

  if (postAttachmentDb.type === PostAttachmentType.Youtube) {
    if (isServer) {
      const youtubeAttachment = await getYouTubeAttachmentServer(
        postAttachmentDb.href
      )
      return youtubeAttachment
    }

    const youtubeAttachment = await getYouTubeAttachmentClient(
      postAttachmentDb.href
    )
    return youtubeAttachment
  }

  throw new Error('Invalid post attachment type')
}

export default getPostAttachment
