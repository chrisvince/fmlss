import { SyntheticEvent, useRef } from 'react'
import { useRouter } from 'next/router'

import { createPost } from '../../utils/callableFirebaseFunctions'

const BODY_ID = 'body'

const ComposePostForm = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

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
      const response = await createPost({ body })
      router.push(`/post/${response.data.id}`)
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

export default ComposePostForm
