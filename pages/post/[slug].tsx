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
} from '../../utils/createCacheKeys'

interface PropTypes {
  fallback: {
    [key: string]: Post | Post[],
  }
}

const PostPageProvider = ({ fallback }: PropTypes) => {
  const router = useRouter()
  const { slug } = router.query as { slug: string }

  return (
    <SWRConfig value={{ fallback }}>
      <PostPage slug={slug} />
    </SWRConfig>
  )
}

const getServerSidePropsFn = async ({
  AuthUser,
  params: { slug },
}: {
  AuthUser: AuthUser
  params: {
    slug: string
  }
}) => {
  const adminDb = getFirebaseAdmin().firestore()
  const uid = AuthUser.id
  const postCacheKey = createPostCacheKey(slug)
  const postRepliesCacheKey = createPostRepliesCacheKey(slug)

  const post = await getPost(slug, {
    uid,
    db: adminDb,
  })

  if (!post?.data) {
    return { notFound: true }
  }

  const replies = await getPostReplies(post.data.reference, slug, {
    uid,
    db: adminDb,
  })

  return {
    props: {
      key: postCacheKey,
      fallback: {
        [postCacheKey]: post,
        [postRepliesCacheKey]: replies,
      },
    },
  }
}

export const getServerSideProps =
  withAuthUserTokenSSR()(getServerSidePropsFn as any)

export default withAuthUser()(PostPageProvider as any)
