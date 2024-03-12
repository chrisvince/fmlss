import firebase from 'firebase/app'
import 'firebase/functions'
import { isNil, reject } from 'ramda'
import { CreatePostAttachment } from '../../types'

interface Input {
  attachments: CreatePostAttachment[]
  body: string
  options: {
    offensiveContent: boolean
    adultContent: boolean
  }
  parentRef?: string
  subtopics: string[]
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
