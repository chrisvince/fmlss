import Error from 'next/error'

import usePost from '../../utils/data/post/usePost'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MobileContainer from '../MobileContainer'
import NewPostForm from '../NewPostForm'
import Page from '../Page'
import PageSpinner from '../PageSpinner'

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
      pageTitle="Reply to Post"
      rightPanelChildren={
        <>
          <MiniHashtagsSection />
          <MiniCategoriesSection />
        </>
      }
    >
      {isLoading ? <PageSpinner /> : (
        <MobileContainer>
          <NewPostForm slug={slug} />
        </MobileContainer>
      )}
    </Page>
  )
}

export default ReplyPage
