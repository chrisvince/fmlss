import { Category, Hashtag, Post } from '../types'

const getLastDocOfLastPage =
  (data: (Category | Hashtag | Post)[][] | undefined) =>
    data?.at?.(-1)?.at?.(-1)?.doc

export default getLastDocOfLastPage
