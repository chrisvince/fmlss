import { Post } from '../types'

const getLastDocOfLastPage = (data: Post[][] | undefined) =>
  data?.at?.(-1)?.at?.(-1)?.doc

export default getLastDocOfLastPage
