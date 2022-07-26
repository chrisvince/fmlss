import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'

import type { Post } from '../../types'
import getPost from '../../utils/data/post/getPost'
import PostPage from '../../components/PostPage'
import getPostReplies from '../../utils/data/postReplies/getPostReplies'
import {
  createPostRepliesCacheKey,
  createPostCacheKey,
  createMiniHashtagsCacheKey,
  createMiniCategoriesCacheKey,
} from '../../utils/createCacheKeys'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import getCategories from '../../utils/data/categories/getCategories'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import usePost from '../../utils/data/post/usePost'
import Error from 'next/error'

const { MINI_LIST_CACHE_TIME, MINI_LIST_COUNT } = constants

interface PropTypes {
  fallback: {
    [key: string]: Post | Post[],
  }
}

const PostPageProvider = ({ fallback }: PropTypes) => {
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
  req: NextApiRequest,
}) => {
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const slug = decodeURIComponent(encodedSlug)
  const uid = AuthUser.id

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

  const miniCategories = await getCategories({
    cacheKey: miniCategoriesCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  if (isInternalRequest(req)) {
    return {
      props: {
        fallback: {
          [miniCategoriesCacheKey]: miniCategories,
          [miniHashtagsCacheKey]: miniHashtags,
          [postCacheKey]: null,
          [postRepliesCacheKey]: null,
        },
        key: postCacheKey,
      },
    }
  }

  const post = await getPost(slug, {
    uid,
    db: adminDb,
  })

  if (!post) {
    return { notFound: true }
  }

  const replies = await getPostReplies(post.data.reference, slug, {
    uid,
    db: adminDb,
  })

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

export const getServerSideProps =
  withAuthUserTokenSSR()(getServerSidePropsFn as any)

export default withAuthUser()(PostPageProvider as any)
