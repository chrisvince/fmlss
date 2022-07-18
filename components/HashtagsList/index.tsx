import { Hashtag } from '../../types'
import ContentList from '../ContentList'
import HashtagListItem from '../HashtagListItem'

type PropTypes = {
  cacheKey: string
  isLoading: boolean
  moreToLoad: boolean
  onLoadMore: () => any
  hashtags: Hashtag[]
}

const HashtagsList = ({
  cacheKey,
  isLoading,
  moreToLoad,
  onLoadMore,
  hashtags,
}: PropTypes) => (
  <ContentList
    cacheKey={cacheKey}
    isLoading={isLoading}
    items={hashtags}
    moreToLoad={moreToLoad}
    onLoadMore={onLoadMore}
  >
    {hashtag => <HashtagListItem hashtag={hashtag} />}
  </ContentList>
)

export default HashtagsList
