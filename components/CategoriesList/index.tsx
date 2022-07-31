import { CellMeasurerCache } from 'react-virtualized'

import { Category } from '../../types'
import CategoryListItem from '../CategoryListItem'
import ContentList from '../ContentList'

type PropTypes = {
  cellMeasurerCache: CellMeasurerCache
  isLoading: boolean
  moreToLoad: boolean
  onLoadMore: () => any
  categories: Category[]
}

const CategoriesList = ({
  cellMeasurerCache,
  isLoading,
  moreToLoad,
  onLoadMore,
  categories,
}: PropTypes) => (
  <ContentList
    cellMeasurerCache={cellMeasurerCache}
    isLoading={isLoading}
    moreToLoad={moreToLoad}
    onLoadMore={onLoadMore}
    items={categories}
  >
    {category => <CategoryListItem category={category} />}
  </ContentList>
)

export default CategoriesList
