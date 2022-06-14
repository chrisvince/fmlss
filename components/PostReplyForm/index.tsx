import { SyntheticEvent, useRef } from 'react'
import type { PostData } from '../../types'

import { createPost } from '../../utils/callableFirebaseFunctions'

const BODY_ID = 'body'

interface PropTypes {
  replyingToReference: PostData['reference']
  onNewReply: (post: any) => void | Promise<void>
}

const PostReplyForm = ({ replyingToReference, onNewReply }: PropTypes) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const body = formData.get(BODY_ID) as string | undefined

    if (!body) {
      console.error('Must have a body')
      return
    }

    if (textareaRef.current) {
      textareaRef.current.disabled = true
    }

    try {
      const response = await createPost({
        replyingToReference,
        body,
      })

      await onNewReply?.(response.data.id)

      if (textareaRef.current) {
        textareaRef.current.value = ''
        textareaRef.current.disabled = false
      }
    } catch (error) {
      if (textareaRef.current) {
        textareaRef.current.disabled = false
      }
      console.error(error)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <textarea
          ref={textareaRef}
          id={BODY_ID}
          name={BODY_ID}
          rows={4}
          cols={50}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default PostReplyForm
