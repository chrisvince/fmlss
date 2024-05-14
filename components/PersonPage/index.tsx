import Page from '../Page'
import Feed from '../Feed'
import SidebarTopicsSection from '../SidebarTopicsSection'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import usePerson from '../../utils/data/person/usePerson'
import usePersonPosts from '../../utils/data/posts/usePersonPosts'
import PageSpinner from '../PageSpinner'
import {
  ResourceType,
  resourceViewed,
} from '../../utils/callableFirebaseFunctions/resourceViewed'
import useDelayedOnMount from '../../utils/useDelayedOnMount'
import SidebarPeopleSection from '../SidebarPeopleSection'
import { CellMeasurerCache } from 'react-virtualized'
import constants from '../../constants'
import NotFoundPage from '../NotFoundPage'
import InlineCreatePost from '../InlineCreatePost'
import { sendGTMEvent } from '@next/third-parties/google'
import { GTMEvent } from '../../types/GTMEvent'
import useOnMount from '../../utils/useOnMount'

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

  const handlePostLoadSuccess = () => {
    cellMeasurerCache.clearAll()
  }

  const { posts, isLoading, moreToLoad, loadMore, likePost, watchPost } =
    usePersonPosts(slug, { swrConfig: { onSuccess: handlePostLoadSuccess } })

  useOnMount(() => {
    sendGTMEvent({
      event: GTMEvent.PersonView,
      slug,
      name: person?.data.name,
    })
  }, !personIsLoading && person)

  useDelayedOnMount(() => {
    if (personIsLoading || !person) return
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
      <InlineCreatePost
        placeholder={`Write something about ${person.data.name}!`}
      />
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
