import { SyntheticEvent, useRef, useState } from 'react'

import { createPost } from '../../utils/callableFirebaseFunctions'
import usePost from '../../utils/data/post/usePost'
import PostBodyTextArea from '../PostBodyTextArea'

type PropTypes = {
  slug: string
  onSuccess?: () => void
}

const PostReplyForm = ({ slug, onSuccess }: PropTypes) => {
  const { post } = usePost(slug)
  const postBodyTextAreaRef = useRef<{clear: () => void}>(null)
  const [disableTextarea, setDisableTextarea] = useState<boolean>(false)
  const [textareaValue, setTextareaValue] = useState<string>('')
  const handleTextInput = (text: string) => setTextareaValue(text)

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()

    if (!post?.data.reference) {
      console.error('No post reference passed')
      return
    }

    if (!textareaValue) {
      console.error('Must have a body')
      return
    }

    setDisableTextarea(true)

    try {
      await createPost({
        replyingToReference: post.data.reference,
        body: textareaValue,
      })

      onSuccess?.()

      postBodyTextAreaRef.current?.clear()
      setDisableTextarea(false)
    } catch (error) {
      setDisableTextarea(false)
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <PostBodyTextArea
          disabled={disableTextarea}
          onChange={handleTextInput}
          ref={postBodyTextAreaRef}
          username="chrisvince"
          placeholder="Write a reply"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default PostReplyForm
