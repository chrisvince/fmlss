import { Category, Hashtag, Post } from '../types'

const getLastDocOfLastPage = (data: any[][] | undefined) =>
  data?.at?.(-1)?.at?.(-1)?.doc

export default getLastDocOfLastPage
