import { useRouter } from 'next/router'
import { useState } from 'react'
import { createPost } from '../../callableFirebaseFunctions'
import usePost from './usePost'
import { CreatePostAttachment } from '../../../types'

interface HandleCreatePostProps {
  attachments: CreatePostAttachment[]
  body: string
  options: {
    offensiveContent: boolean
    adultContent: boolean
  }
  subtopics?: string[]
}

const useCreatePost = (parentSlug?: string) => {
  const { push: navigate } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { post } = usePost(parentSlug)

  const handleCreatePost = async ({
    attachments,
    body,
    options,
    subtopics = [],
  }: HandleCreatePostProps) => {
    if (!body) {
      setErrorMessage('Post is required!')
      return
    }

    setIsLoading(true)

    try {
      const { data } = await createPost({
        attachments,
        body,
        options,
        parentRef: post?.data.reference,
        subtopics,
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
