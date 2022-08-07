import { CellMeasurerCache } from 'react-virtualized'

import { Hashtag } from '../../types'
import ContentList from '../ContentList'
import ContentSpinner from '../ContentSpinner'
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
}: Props) =>
  isLoading ? (
    <ContentSpinner />
  ) : (
    <ContentList
      cellMeasurerCache={cellMeasurerCache}
      items={hashtags}
      moreToLoad={moreToLoad}
      onLoadMore={onLoadMore}
    >
      {hashtag => <HashtagListItem hashtag={hashtag} />}
    </ContentList>
  )

export default HashtagsList
