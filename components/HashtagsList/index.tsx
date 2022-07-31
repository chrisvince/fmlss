import { CellMeasurerCache } from 'react-virtualized'

import { Hashtag } from '../../types'
import ContentList from '../ContentList'
import HashtagListItem from '../HashtagListItem'

type Props = {
  cellMeasurerCache: CellMeasurerCache
  isLoading: boolean
  moreToLoad: boolean
  onLoadMore: () => any
  hashtags: Hashtag[]
}

const HashtagsList = ({
  cellMeasurerCache,
  isLoading,
  moreToLoad,
  onLoadMore,
  hashtags,
}: Props) => (
  <ContentList
    cellMeasurerCache={cellMeasurerCache}
    isLoading={isLoading}
    items={hashtags}
    moreToLoad={moreToLoad}
    onLoadMore={onLoadMore}
  >
    {hashtag => <HashtagListItem hashtag={hashtag} />}
  </ContentList>
)

export default HashtagsList
