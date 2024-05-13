import usePost from '../../utils/data/post/usePost'
import SidebarTopicsSection from '../SidebarTopicsSection'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import MobileContainer from '../MobileContainer'
import NewPostForm from '../NewPostForm'
import Page from '../Page'
import PageSpinner from '../PageSpinner'
import constants from '../../constants'
import SidebarPeopleSection from '../SidebarPeopleSection'
import NotFoundPage from '../NotFoundPage'

const { TOPICS_ENABLED } = constants

interface Props {
  slug: string
}

const ReplyPage = ({ slug }: Props) => {
  const { isLoading, post } = usePost(slug)

  if (!isLoading && !post) {
    return <NotFoundPage />
  }

  return (
    <Page
      description="Reply to a post on Fameless."
      pageTitle="Reply to Post"
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarPeopleSection />
          {TOPICS_ENABLED && <SidebarTopicsSection />}
          <SidebarHashtagsSection />
        </>
      }
    >
      {isLoading ? (
        <PageSpinner />
      ) : (
        <MobileContainer>
          <NewPostForm slug={slug} />
        </MobileContainer>
      )}
    </Page>
  )
}

export default ReplyPage
