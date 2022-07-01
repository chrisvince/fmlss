import { SyntheticEvent, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { createPost } from '../../utils/callableFirebaseFunctions'
import PostBodyTextArea from '../PostBodyTextArea'

const NewPostForm = () => {
  const router = useRouter()
  const postBodyTextAreaRef = useRef<{ clear: () => void }>(null)
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
      const response = await createPost({ body: textareaValue })
      router.push(`/post/${encodeURIComponent(response.data.id)}`)
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

export default NewPostForm
