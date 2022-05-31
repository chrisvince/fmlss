import { SyntheticEvent, useRef } from 'react'
import firebase from 'firebase/app'
import 'firebase/functions'
import { useRouter } from 'next/router'

const functions = firebase.functions()
const createPost = functions.httpsCallable('createPost')

const BODY_ID = 'body'

const ComposePostForm = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const body = formData.get(BODY_ID)
    console.log(body)

    try {
      const response = await createPost({ body })
      if (textareaRef.current) {
        textareaRef.current.value = ''
      }
      router.push(`/post/${response.data.id}`)
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

export default ComposePostForm
