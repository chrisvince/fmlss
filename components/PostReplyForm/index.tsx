import { SyntheticEvent, useRef } from 'react'
import firebase from 'firebase/app'
import 'firebase/functions'
import type { Post } from '../../types'

const functions = firebase.functions()
const createPost = functions.httpsCallable('createPost')

const BODY_ID = 'body'

interface PropTypes {
  replyingToReference: Post['reference']
}

const PostReplyForm = ({ replyingToReference }: PropTypes) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const body = formData.get(BODY_ID)

    try {
      await createPost({
        replyingToReference,
        body,
      })
      if (textareaRef.current) {
        textareaRef.current.value = ''
      }
    } catch (error) {
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
