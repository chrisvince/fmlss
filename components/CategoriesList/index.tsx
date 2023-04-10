import { CellMeasurerCache } from 'react-virtualized'
import { useRef } from 'react'

import { Category } from '../../types'
import CategoryListItem from '../CategoryListItem'
import CenteredMessage from '../CenteredMessage'
import ContentList from '../ContentList'
import ContentSpinner from '../ContentSpinner'
import constants from '../../constants'

const { CELL_CACHE_MEASURER_CATEGORY_ITEM_MIN_HEIGHT } = constants

type PropTypes = {
  isLoading: boolean
  moreToLoad: boolean
  onLoadMore: () => Promise<unknown>
  categories: Category[]
}

const CategoriesList = ({
  isLoading,
  moreToLoad,
  onLoadMore,
  categories,
}: PropTypes) => {
  const cellMeasurerCache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      minHeight: CELL_CACHE_MEASURER_CATEGORY_ITEM_MIN_HEIGHT,
    })
  )

  return isLoading ? (
    <ContentSpinner />
  ) : categories.length ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache.current}
      moreToLoad={moreToLoad}
      onLoadMore={onLoadMore}
      items={categories}
    >
      {category => <CategoryListItem category={category as Category} />}
    </ContentList>
  ) : (
    <CenteredMessage>No categories.</CenteredMessage>
  )
}

export default CategoriesList
