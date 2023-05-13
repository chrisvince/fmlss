import { NextApiRequest } from 'next'
import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'

import ReplyPage from '../../../components/ReplyPage'
import {
  createMiniCategoriesCacheKey,
  createMiniHashtagsCacheKey,
  createPostCacheKey,
} from '../../../utils/createCacheKeys'
import getCategories from '../../../utils/data/categories/getCategories'
import getHashtags from '../../../utils/data/hashtags/getHashtags'
import getPost from '../../../utils/data/post/getPost'
import isInternalRequest from '../../../utils/isInternalRequest'
import constants from '../../../constants'
import checkIfUserHasUsername from '../../../utils/data/user/checkIfUserHasUsername'

const {
  CATEGORIES_ENABLED,
  GET_SERVER_SIDE_PROPS_TIME_LABEL,
  MINI_LIST_CACHE_TIME,
  MINI_LIST_COUNT,
} = constants

interface Props {
  fallback: {
    [key: string]: unknown
  }
}

const ReplyToPost = ({ fallback }: Props) => {
  const router = useRouter()
  const { slug } = router.query as { slug: string }

  return (
    <SWRConfig value={{ fallback }}>
      <ReplyPage slug={slug} />
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
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return { notFound: true }
  }

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        [miniCategoriesCacheKey]: miniCategories,
        [miniHashtagsCacheKey]: miniHashtags,
        [postCacheKey]: post,
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
export default withAuthUser()(ReplyToPost as any)
