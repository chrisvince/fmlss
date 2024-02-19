import usePeople from '../../utils/data/people/usePeople'
import Page from '../Page'
import PeopleList from '../PeopleList'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarTopicsSection from '../SidebarTopicsSection'

const PeoplePage = () => {
  const { isLoading, loadMore, moreToLoad, people } = usePeople()

  return (
    <Page
      description="See people tagged on Fameless"
      pageTitle="People"
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarHashtagsSection />
          <SidebarTopicsSection />
        </>
      }
    >
      <PeopleList
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
        people={people}
      />
    </Page>
  )
}

export default PeoplePage
