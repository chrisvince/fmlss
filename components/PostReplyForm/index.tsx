import { SyntheticEvent, useRef } from 'react'

import { createPost } from '../../utils/callableFirebaseFunctions'
import usePost from '../../utils/data/post/usePost'
import usePostReplies from '../../utils/data/postReplies/usePostReplies'

const BODY_ID = 'body'

type PropTypes = {
  slug: string
}

const PostReplyForm = ({ slug }: PropTypes) => {
  const { post, mutate: refreshPost } = usePost(slug)
  const { mutate: refreshReplies } = usePostReplies(post.data.reference)
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
      await createPost({
        replyingToReference: post.data.reference,
        body,
      })

      refreshReplies()
      refreshPost()

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
