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
  params,
}: {
  AuthUser: AuthUser
  params: {
    slug: string
  }
}) => {
  const adminDb = getFirebaseAdmin().firestore()
  const uid = AuthUser.id
  const { slug } = params

  const post = await getPost(slug, {
    uid,
    db: adminDb,
  })

  if (!post.data) {
    return { notFound: true }
  }

  const replies = await getPostReplies(post.data.reference, {
    uid,
    db: adminDb,
  })

  return {
    props: {
      key: post.data.id,
      fallback: {
        [slug]: post,
        [`${post.data.reference}/posts`]: replies,
      },
    },
  }
}

export const getServerSideProps =
  withAuthUserTokenSSR()(getServerSidePropsFn as any)

export default withAuthUser()(PostPageProvider as any)
