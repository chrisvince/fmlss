import Error from 'next/error'

import usePost from '../../utils/data/post/usePost'
import SidebarTopicsSection from '../SidebarTopicsSection'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import MobileContainer from '../MobileContainer'
import NewPostForm from '../NewPostForm'
import Page from '../Page'
import PageSpinner from '../PageSpinner'
import constants from '../../constants'
import SidebarPeopleSection from '../SidebarPeopleSection'
import { PostType } from '../../utils/usePostBodyTextAreaPlaceholder'

const { TOPICS_ENABLED } = constants

interface Props {
  slug: string
}

const ReplyPage = ({ slug }: Props) => {
  const { isLoading, post } = usePost(slug)

  if (!isLoading && !post) {
    return <Error statusCode={404} />
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
          <NewPostForm postType={PostType.Reply} slug={slug} />
        </MobileContainer>
      )}
    </Page>
  )
}

export default ReplyPage
