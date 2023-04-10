import { CellMeasurerCache } from 'react-virtualized'

import { Category } from '../../types'
import CategoryListItem from '../CategoryListItem'
import CenteredMessage from '../CenteredMessage'
import ContentList from '../ContentList'
import ContentSpinner from '../ContentSpinner'

type PropTypes = {
  cellMeasurerCache: CellMeasurerCache
  isLoading: boolean
  moreToLoad: boolean
  onLoadMore: () => Promise<unknown>
  categories: Category[]
}

const CategoriesList = ({
  cellMeasurerCache,
  isLoading,
  moreToLoad,
  onLoadMore,
  categories,
}: PropTypes) => {
  return isLoading ? (
    <ContentSpinner />
  ) : categories.length ? (
    <ContentList
      cellMeasurerCache={cellMeasurerCache}
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
