import { useAuthUser } from 'next-firebase-auth'
import Link from 'next/link'
import type { Post } from '../../types'
import useIsNewPost from '../../utils/useIsNewPost'

import { useEffect, useState } from 'react'
import getPosts from '../../utils/data/posts/getPosts'
import getMorePosts from '../../utils/data/posts/getMorePosts'

interface PropTypes {
  initPosts: Post[]
}

const Feed = ({ initPosts }: PropTypes) => {
  const [posts, setPosts] = useState<Post[]>(initPosts)
  const { id: uid } = useAuthUser()

  useEffect(() => {
    const hydratePosts = async () => {
      const posts = await getPosts({ uid })
      setPosts(posts)
    }
    hydratePosts()
  }, [uid])

  const handleLoadMoreClick = async () => {
    const newPost = await getMorePosts(posts, { uid })
    setPosts(newPost)
  }

  const isNewPost = useIsNewPost(posts)

  const isPosts = !!(posts && posts.length)

  return (
    <div>
      <h2>Feed</h2>
      {isNewPost && <div>Load new posts</div>}
      {isPosts ? (
        <ul>
          {posts.map(({ createdByUser, data }) => (
            <li key={data!.id}>
              <Link href={`/post/${data!.id}`}>
                <a>
                  {data!.id} / {data!.body}
                  {createdByUser && ' / Created by me'}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts.</p>
      )}
      <button onClick={handleLoadMoreClick}>
        Load more
      </button>
    </div>
  )
}

export default Feed
