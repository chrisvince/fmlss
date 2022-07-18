import { Category } from '../../types'
import CategoryListItem from '../CategoryListItem'
import ContentList from '../ContentList'

type PropTypes = {
  cacheKey: string
  isLoading: boolean
  moreToLoad: boolean
  onLoadMore: () => any
  categories: Category[]
}

const CategoriesList = ({
  cacheKey,
  isLoading,
  moreToLoad,
  onLoadMore,
  categories,
}: PropTypes) => (
  <ContentList
    cacheKey={cacheKey}
    isLoading={isLoading}
    moreToLoad={moreToLoad}
    onLoadMore={onLoadMore}
    items={categories}
  >
    {category => <CategoryListItem category={category} />}
  </ContentList>
)

export default CategoriesList
