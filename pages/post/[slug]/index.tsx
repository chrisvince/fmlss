import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import PostPage from '../../../components/PostPage'
import {
  createPostCacheKey,
  createPostRepliesSWRGetKey,
} from '../../../utils/createCacheKeys'
import constants from '../../../constants'
import isInternalRequest from '../../../utils/isInternalRequest'
import getSidebarDataServer from '../../../utils/data/sidebar/getSidebarDataServer'
import Layout from '../../../components/Layout'
import { ReactElement } from 'react'
import getPostRepliesServer from '../../../utils/data/postReplies/getPostRepliesServer'
import getPostServer from '../../../utils/data/post/getPostServer'
import { GetServerSideProps } from 'next'
import getUidFromCookies from '../../../utils/auth/getUidFromCookies'
import { unstable_serialize } from 'swr/infinite'

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

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const slug = params?.slug as string
  const uid = await getUidFromCookies(req.cookies)
  const postCacheKey = createPostCacheKey(slug)

  const postRepliesCacheKey = createPostRepliesSWRGetKey({
    slug: slug,
    uid,
  })

  const sidebarDataPromise = getSidebarDataServer()

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

  const [replies, sidebarFallbackData] = await Promise.all([
    POST_REPLIES_SSR
      ? getPostRepliesServer(post.data.reference, slug, { uid })
      : [],
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        [postCacheKey]: post,
        [unstable_serialize(postRepliesCacheKey)]: [replies],
        ...sidebarFallbackData,
      },
      key: postCacheKey,
    },
  }
}

export default Post
