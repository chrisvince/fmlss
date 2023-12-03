import { CellMeasurerCache } from 'react-virtualized'
import { useRef } from 'react'

import { Hashtag } from '../../types'
import CenteredMessage from '../CenteredMessage'
import ContentList from '../ContentList'
import HashtagListItem from '../HashtagListItem'
import constants from '../../constants'
import PageSpinner from '../PageSpinner'

const { CELL_CACHE_MEASURER_HASHTAG_ITEM_MIN_HEIGHT } = constants

type Props = {
  isLoading: boolean
  moreToLoad: boolean
  onLoadMore: () => Promise<unknown>
  hashtags: Hashtag[]
}

const HashtagsList = ({
  isLoading,
  moreToLoad,
  onLoadMore,
  hashtags,
}: Props) => {
  const cellMeasurerCache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      minHeight: CELL_CACHE_MEASURER_HASHTAG_ITEM_MIN_HEIGHT,
    })
  )

  return isLoading ? (
    <PageSpinner />
  ) : hashtags.length ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache.current}
      items={hashtags}
      moreToLoad={moreToLoad}
      onLoadMore={onLoadMore}
    >
      {hashtag => (
        <HashtagListItem
          hashtag={hashtag as Hashtag}
          key={(hashtag as Hashtag).data.id}
        />
      )}
    </ContentList>
  ) : (
    <CenteredMessage>No hashtags.</CenteredMessage>
  )
}

export default HashtagsList
