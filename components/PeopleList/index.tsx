import { CellMeasurerCache } from 'react-virtualized'
import { useRef } from 'react'

import CenteredMessage from '../CenteredMessage'
import ContentList from '../ContentList'
import constants from '../../constants'
import PageSpinner from '../PageSpinner'
import { Person } from '../../types/Person'
import PersonListItem from '../PersonListItem'

const { CELL_CACHE_MEASURER_PEOPLE_ITEM_MIN_HEIGHT } = constants

type PropTypes = {
  isLoading: boolean
  moreToLoad: boolean
  onLoadMore: () => Promise<unknown>
  people: Person[]
}

const PeopleList = ({
  isLoading,
  moreToLoad,
  onLoadMore,
  people,
}: PropTypes) => {
  const cellMeasurerCache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      minHeight: CELL_CACHE_MEASURER_PEOPLE_ITEM_MIN_HEIGHT,
    })
  )

  return people.length === 0 && isLoading ? (
    <PageSpinner />
  ) : people.length > 0 ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache.current}
      moreToLoad={moreToLoad}
      onLoadMore={onLoadMore}
      items={people}
    >
      {person => (
        <PersonListItem
          person={person as Person}
          key={(person as Person).data.id}
        />
      )}
    </ContentList>
  ) : (
    <CenteredMessage>No people.</CenteredMessage>
  )
}

export default PeopleList
