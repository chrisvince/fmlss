import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { createPost } from '../../callableFirebaseFunctions'
import usePost from './usePost'
import { CreatePostAttachment } from '../../../types'
import { MediaInputItem } from '../../../types/MediaInputItem'

interface HandleCreatePostProps {
  attachments: CreatePostAttachment[]
  body: string
  media: MediaInputItem[]
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
  const createPostInProgressRef = useRef<boolean>(false)

  const handleCreatePost = async ({
    attachments = [],
    body,
    media = [],
    options,
    subtopics = [],
  }: HandleCreatePostProps) => {
    if (createPostInProgressRef.current) return
    createPostInProgressRef.current = true

    if (!body) {
      setErrorMessage('Post is required!')
      createPostInProgressRef.current = false
      return
    }

    setIsLoading(true)

    try {
      const { data } = await createPost({
        attachments,
        body,
        media,
        options,
        parentRef: post?.data.reference,
        subtopics,
      })
      await navigate(`/post/${data.slug}`)
    } catch (error) {
      setIsLoading(false)
      setErrorMessage('There was an error. Please try again later.')
      console.error('error', error)
    }

    createPostInProgressRef.current = false
  }

  return {
    createPost: handleCreatePost,
    errorMessage,
    isLoading,
  }
}

export default useCreatePost
