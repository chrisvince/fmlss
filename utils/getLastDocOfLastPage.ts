import { Hashtag, Post } from '../types'

const getLastDocOfLastPage = (data: (Hashtag | Post)[][] | undefined) =>
  data?.at?.(-1)?.at?.(-1)?.doc

export default getLastDocOfLastPage
