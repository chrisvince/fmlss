import { useRouter } from 'next/router'
import { useState } from 'react'
import { PostPreview } from '../../../types'
import { createPost } from '../../callableFirebaseFunctions'
import usePost from './usePost'

interface HandleCreatePost {
  body?: string
  topic?: string
  linkPreviews?: PostPreview[]
}

const useCreatePost = (parentSlug?: string) => {
  const { push: navigate } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { post } = usePost(parentSlug)

  const handleCreatePost = async ({
    body,
    topic,
    linkPreviews,
  }: HandleCreatePost) => {
    if (!body) {
      setErrorMessage('Post is required!')
      return
    }

    setIsLoading(true)

    try {
      const { data } = await createPost({
        body,
        topic,
        linkPreviews,
        parentRef: post?.data.reference,
      })
      await navigate(`/post/${data.slug}`)
      setIsLoading(false)
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
