import { useRouter } from 'next/router'
import { useState } from 'react'
import { createPost } from '../../callableFirebaseFunctions'
import usePost from './usePost'
import { CreatePostAttachment } from '../../../types'

interface HandleCreatePostProps {
  body: string
  subtopics?: string[]
  attachments: CreatePostAttachment[]
}

const useCreatePost = (parentSlug?: string) => {
  const { push: navigate } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { post } = usePost(parentSlug)

  const handleCreatePost = async ({
    body,
    subtopics = [],
    attachments,
  }: HandleCreatePostProps) => {
    if (!body) {
      setErrorMessage('Post is required!')
      return
    }

    setIsLoading(true)

    try {
      const { data } = await createPost({
        body,
        subtopics,
        attachments,
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
