import { SyntheticEvent, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { createPost } from '../../utils/callableFirebaseFunctions'
import PostBodyTextArea from '../PostBodyTextArea'
import { TextField } from '@mui/material'

const NewPostForm = () => {
  const router = useRouter()
  const postBodyTextAreaRef = useRef<{ clear: () => void }>(null)
  const [disableTextarea, setDisableTextarea] = useState<boolean>(false)
  const [textareaValue, setTextareaValue] = useState<string>('')
  const handleTextInput = (text: string) => setTextareaValue(text)

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const category = formData.get('category') as string | null

    if (!textareaValue) {
      console.error('Must have a body')
      return
    }

    setDisableTextarea(true)

    try {
      const response = await createPost({ body: textareaValue, category })
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
      <div>
        <TextField id="category" name="category" label="Category" />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default NewPostForm
