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
import { createPostCacheKey } from '../../../utils/createCacheKeys'
import getPost from '../../../utils/data/post/getPost'
import isInternalRequest from '../../../utils/isInternalRequest'
import constants from '../../../constants'
import fetchSidebarFallbackData from '../../../utils/data/sidebar/fetchSidebarData'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

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
  const postCacheKey = createPostCacheKey(slug)
  const sidebarDataPromise = fetchSidebarFallbackData({ db: adminDb })

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

  const [post, sidebarFallbackData] = await Promise.all([
    getPost(slug, {
      uid,
      db: adminDb,
    }),
    sidebarDataPromise,
  ])

  if (!post) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return { notFound: true }
  }

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        ...sidebarFallbackData,
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
