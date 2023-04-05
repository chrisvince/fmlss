import firebase from 'firebase/app'
import 'firebase/functions'
import { isNil, reject } from 'ramda'

import { PostPreview } from '../../types'

interface Input {
  body: string
  category?: string | null
  linkPreviews?: PostPreview[]
  parentRef?: string
}

type Response = {
  data: {
    id: string
    slug: string
  }
}

type CreatePost = (data: Input) => Promise<Response>

export const createPost: CreatePost = data => {
  const filteredData = reject(isNil)(data)
  const functions = firebase.functions()
  return functions.httpsCallable('post-create')(filteredData)
}
