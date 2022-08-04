import { useRouter } from 'next/router'
import { useState } from 'react'
import { createPost } from '../../callableFirebaseFunctions'
import usePost from './usePost'

interface HandleCreatePost {
  body?: string
  category?: string
}

const useCreatePost = (slug?: string) => {
  const { push: navigate } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { post } = usePost(slug)

  const handleCreatePost = async ({ body, category }: HandleCreatePost) => {
    if (!body) {
      setErrorMessage('Body is required.')
      return
    }

    setIsLoading(true)

    if (!post?.data.reference) {
      try {
        const { data } = await createPost({
          body,
          category,
        })
        navigate(`/post/${data.slug}`)
      } catch (error) {
        setIsLoading(false)
        setErrorMessage('There was an error. Please try again later.')
        console.error('error', error)
      }
      return
    }

    try {
      const { data } = await createPost({
        body,
        category,
        replyingToReference: post.data.reference,
      })
      navigate(`/post/${data.slug}`)
    } catch (error) {
      setIsLoading(false)
      setErrorMessage('There was an error. Please try again later.')
      console.error('error', error)
    }
  }

  return {
    createPost: handleCreatePost,
    errorMessage,
    isLoading,
  }
}

export default useCreatePost
