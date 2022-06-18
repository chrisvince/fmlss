import { SyntheticEvent, useRef, useState } from 'react'

import { createPost } from '../../utils/callableFirebaseFunctions'
import usePost from '../../utils/data/post/usePost'
import usePostReplies from '../../utils/data/postReplies/usePostReplies'
import PostBodyTextArea from '../PostBodyTextArea'

const BODY_ID = 'body'

type PropTypes = {
  slug: string
}

const PostReplyForm = ({ slug }: PropTypes) => {
  const { post, mutate: refreshPost } = usePost(slug)
  const { mutate: refreshReplies } = usePostReplies(post.data.slug)
  const postBodyTextAreaRef = useRef<{clear: () => void}>(null)
  const [disableTextarea, setDisableTextarea] = useState<boolean>(false)
  const [textareaValue, setTextareaValue] = useState<string>('')
  const handleTextInput = (text: string) => setTextareaValue(text)

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()

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

      const refreshPromises = [refreshPost(), refreshReplies()]
      await Promise.all(refreshPromises)

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
          ref={postBodyTextAreaRef}
          disabled={disableTextarea}
          onChange={handleTextInput}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default PostReplyForm
