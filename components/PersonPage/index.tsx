import Page from '../Page'
import Feed from '../Feed'
import SidebarTopicsSection from '../SidebarTopicsSection'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import usePerson from '../../utils/data/person/usePerson'
import usePersonPosts from '../../utils/data/posts/usePersonPosts'
import PageSpinner from '../PageSpinner'
import useTracking from '../../utils/tracking/useTracking'
import {
  ResourceType,
  resourceViewed,
} from '../../utils/callableFirebaseFunctions/resourceViewed'
import useDelayedOnMount from '../../utils/useDelayedOnMount'
import { useUser } from 'next-firebase-auth'
import SidebarPeopleSection from '../SidebarPeopleSection'
import { CellMeasurerCache } from 'react-virtualized'
import constants from '../../constants'
import NotFoundPage from '../NotFoundPage'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT } = constants

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

type Props = {
  slug: string
}

const PersonPage = ({ slug }: Props) => {
  const { person, isLoading: personIsLoading } = usePerson(slug)
  const { track } = useTracking()
  const { id: uid } = useUser()

  const handlePostLoadSuccess = () => {
    cellMeasurerCache.clearAll()
  }

  const { posts, isLoading, moreToLoad, loadMore, likePost, watchPost } =
    usePersonPosts(slug, { swrConfig: { onSuccess: handlePostLoadSuccess } })

  useDelayedOnMount(() => {
    if (!uid || personIsLoading || (!personIsLoading && !person)) return
    track('post', { slug }, { onceOnly: true })
    resourceViewed({ resourceType: ResourceType.Person, slug })
  })

  if (personIsLoading) {
    return <PageSpinner />
  }

  if (!person) {
    return <NotFoundPage />
  }

  return (
    <Page
      description={`See posts with with ${person?.data.name} tagged on Fameless`}
      pageTitle={person?.data.name}
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarPeopleSection />
          <SidebarTopicsSection />
          <SidebarHashtagsSection />
        </>
      }
    >
      <Feed
        cellMeasurerCache={cellMeasurerCache}
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        onWatchPost={watchPost}
        posts={posts}
      />
    </Page>
  )
}

export default PersonPage
