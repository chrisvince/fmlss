import { CellMeasurerCache } from 'react-virtualized'
import { useRef } from 'react'

import { Topic } from '../../types'
import TopicListItem from '../TopicListItem'
import CenteredMessage from '../CenteredMessage'
import ContentList from '../ContentList'
import constants from '../../constants'
import PageSpinner from '../PageSpinner'

const { CELL_CACHE_MEASURER_TOPIC_ITEM_MIN_HEIGHT } = constants

type PropTypes = {
  isLoading: boolean
  moreToLoad: boolean
  onLoadMore: () => Promise<unknown>
  topics: Topic[]
}

const TopicsList = ({
  isLoading,
  moreToLoad,
  onLoadMore,
  topics,
}: PropTypes) => {
  const cellMeasurerCache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      minHeight: CELL_CACHE_MEASURER_TOPIC_ITEM_MIN_HEIGHT,
    })
  )

  return isLoading ? (
    <PageSpinner />
  ) : topics.length ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache.current}
      moreToLoad={moreToLoad}
      onLoadMore={onLoadMore}
      items={topics}
    >
      {topic => (
        <TopicListItem topic={topic as Topic} key={(topic as Topic).data.id} />
      )}
    </ContentList>
  ) : (
    <CenteredMessage>No topics.</CenteredMessage>
  )
}

export default TopicsList
