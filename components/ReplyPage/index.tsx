import Error from 'next/error'

import usePost from '../../utils/data/post/usePost'
import SidebarCategoriesSection from '../SidebarCategoriesSection'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import MobileContainer from '../MobileContainer'
import NewPostForm from '../NewPostForm'
import Page from '../Page'
import PageSpinner from '../PageSpinner'
import constants from '../../constants'

const { CATEGORIES_ENABLED } = constants

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
      rightPanelChildren={
        <>
          <SidebarHashtagsSection />
          {CATEGORIES_ENABLED && <SidebarCategoriesSection />}
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
