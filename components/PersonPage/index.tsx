import Page from '../Page'
import Feed from '../Feed'
import SidebarTopicsSection from '../SidebarTopicsSection'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import usePerson from '../../utils/data/person/usePerson'
import usePersonPosts from '../../utils/data/posts/usePersonPosts'
import PageSpinner from '../PageSpinner'
import Error from 'next/error'
import useTracking from '../../utils/tracking/useTracking'
import {
  ResourceType,
  resourceViewed,
} from '../../utils/callableFirebaseFunctions/resourceViewed'
import useDelayedOnMount from '../../utils/useDelayedOnMount'
import { useAuthUser } from 'next-firebase-auth'

type Props = {
  slug: string
}

const PersonPage = ({ slug }: Props) => {
  const { person, isLoading: personIsLoading } = usePerson(slug)
  const { track } = useTracking()
  const { id: uid } = useAuthUser()

  const { posts, isLoading, moreToLoad, loadMore, likePost, watchPost } =
    usePersonPosts(slug)

  useDelayedOnMount(() => {
    if (!uid || personIsLoading || (!personIsLoading && !person)) return
    track('post', { slug }, { onceOnly: true })
    resourceViewed({ resourceType: ResourceType.Person, slug })
  })

  if (personIsLoading) {
    return <PageSpinner />
  }

  if (!person) {
    return <Error statusCode={404} />
  }

  return (
    <Page
      description={`See posts with with ${person?.data.name} tagged on Fameless`}
      pageTitle={person?.data.name}
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarTopicsSection />
          <SidebarHashtagsSection />
        </>
      }
    >
      <Feed
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
