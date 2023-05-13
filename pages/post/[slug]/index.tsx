import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { NextApiRequest } from 'next'
import Error from 'next/error'

import getPost from '../../../utils/data/post/getPost'
import PostPage from '../../../components/PostPage'
import getPostReplies from '../../../utils/data/postReplies/getPostReplies'
import {
  createMiniCategoriesCacheKey,
  createMiniHashtagsCacheKey,
  createPostCacheKey,
  createPostRepliesCacheKey,
} from '../../../utils/createCacheKeys'
import getHashtags from '../../../utils/data/hashtags/getHashtags'
import getCategories from '../../../utils/data/categories/getCategories'
import constants from '../../../constants'
import isInternalRequest from '../../../utils/isInternalRequest'
import usePost from '../../../utils/data/post/usePost'
import checkIfUserHasUsername from '../../../utils/data/user/checkIfUserHasUsername'

const {
  CATEGORIES_ENABLED,
  GET_SERVER_SIDE_PROPS_TIME_LABEL,
  MINI_LIST_CACHE_TIME,
  MINI_LIST_COUNT,
  POST_REPLIES_SSR,
} = constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const Post = ({ fallback }: PropTypes) => {
  const router = useRouter()
  const { slug } = router.query as { slug: string }
  const { post, isLoading } = usePost(slug)

  if (!isLoading && !post) {
    return <Error statusCode={404} />
  }

  return (
    <SWRConfig value={{ fallback }}>
      <PostPage slug={slug} />
    </SWRConfig>
  )
}

const getServerSidePropsFn = async ({
  AuthUser,
  params: { slug: encodedSlug },
  req,
}: {
  AuthUser: AuthUser
  params: {
    slug: string
  }
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const slug = decodeURIComponent(encodedSlug)
  const uid = AuthUser.id
  const userHasUsername = await checkIfUserHasUsername(uid, { db: adminDb })

  if (uid && !userHasUsername) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      redirect: {
        destination: '/sign-up/username',
        permanent: false,
      },
    }
  }

  const postCacheKey = createPostCacheKey(slug)
  const postRepliesCacheKey = createPostRepliesCacheKey(slug)
  const miniHashtagsCacheKey = createMiniHashtagsCacheKey()
  const miniCategoriesCacheKey = createMiniCategoriesCacheKey()

  const miniHashtags = await getHashtags({
    cacheKey: miniHashtagsCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  const miniCategories = CATEGORIES_ENABLED
    ? await getCategories({
        cacheKey: miniCategoriesCacheKey,
        cacheTime: MINI_LIST_CACHE_TIME,
        db: adminDb,
        limit: MINI_LIST_COUNT,
      })
    : []

  if (isInternalRequest(req)) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      props: {
        fallback: {
          ...(CATEGORIES_ENABLED
            ? { [miniCategoriesCacheKey]: miniCategories }
            : {}),
          [miniHashtagsCacheKey]: miniHashtags,
          [postCacheKey]: null,
          [postRepliesCacheKey]: null,
        },
        key: postCacheKey,
      },
    }
  }

  let post
  try {
    post = await getPost(slug, {
      uid,
      db: adminDb,
    })
  } catch (error) {
    return { notFound: true }
  }

  if (!post) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return { notFound: true }
  }

  const replies = POST_REPLIES_SSR
    ? await getPostReplies(post.data.reference, slug, {
        uid,
        db: adminDb,
      })
    : null

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        [miniCategoriesCacheKey]: miniCategories,
        [miniHashtagsCacheKey]: miniHashtags,
        [postCacheKey]: post,
        [postRepliesCacheKey]: replies,
      },
      key: postCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getServerSidePropsFn as any
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser()(Post as any)
