import { AuthAction, withUser, withUserTokenSSR } from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import PostPage from '../../../components/PostPage'
import {
  createPostCacheKey,
  createPostRepliesCacheKey,
  createUserCacheKey,
} from '../../../utils/createCacheKeys'
import constants from '../../../constants'
import isInternalRequest from '../../../utils/isInternalRequest'
import getSidebarDataServer from '../../../utils/data/sidebar/getSidebarDataServer'
import Layout from '../../../components/Layout'
import { ReactElement } from 'react'
import getUserDataServer from '../../../utils/data/user/getUserDataServer'
import getPostRepliesServer from '../../../utils/data/postReplies/getPostRepliesServer'
import getPostServer from '../../../utils/data/post/getPostServer'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL, POST_REPLIES_SSR } = constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const Post = ({ fallback }: PropTypes) => {
  const router = useRouter()
  const { slug } = router.query as { slug: string }

  return (
    <SWRConfig value={{ fallback }}>
      <PostPage slug={slug} />
    </SWRConfig>
  )
}

Post.getLayout = function getLayout(page: ReactElement) {
  return <Layout disableNavBottomPaddingXs>{page}</Layout>
}

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
  whenUnauthed: AuthAction.RENDER,
})(async ({ user, params, req }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const slug = params?.slug as string
  const uid = user?.id
  const postCacheKey = createPostCacheKey(slug)
  const postRepliesCacheKey = createPostRepliesCacheKey(slug)
  const sidebarDataPromise = getSidebarDataServer()
  const userCacheKey = uid ? createUserCacheKey(uid) : undefined

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
        key: postCacheKey,
      },
    }
  }

  const post = await getPostServer(slug, { uid })

  if (!post) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return { notFound: true }
  }

  const [replies, sidebarFallbackData, userData] = await Promise.all([
    POST_REPLIES_SSR
      ? getPostRepliesServer(post.data.reference, slug, { uid })
      : null,
    sidebarDataPromise,
    userCacheKey && uid ? getUserDataServer(uid) : null,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        [postCacheKey]: post,
        [postRepliesCacheKey]: replies,
        ...sidebarFallbackData,
        ...(userCacheKey ? { [userCacheKey]: userData } : {}),
      },
      key: postCacheKey,
    },
  }
})

export default withUser<PropTypes>({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.RENDER,
})(Post)
