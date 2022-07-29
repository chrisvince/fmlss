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

const { MINI_LIST_CACHE_TIME, MINI_LIST_COUNT } = constants

interface Props {
  fallback: {
    [key: string]: any
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
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const slug = decodeURIComponent(encodedSlug)
  const uid = AuthUser.id

  const postCacheKey = createPostCacheKey(slug)
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
  getServerSidePropsFn as any
)

export default withAuthUser()(ReplyToPost as any)
