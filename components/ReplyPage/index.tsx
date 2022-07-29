import usePost from '../../utils/data/post/usePost'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MiniHashtagsSection from '../MiniHashtagsSection'
import Page from '../Page'
import PageSpinner from '../PageSpinner'
import PostItem from '../PostItem'
import PostReplyForm from '../PostReplyForm'

interface Props {
  slug: string
}

const ReplyPage = ({ slug }: Props) => {
  const { isLoading } = usePost(slug)

  if (isLoading) {
    return <PageSpinner />
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
      <PostItem hideActionBar slug={slug} />
      <PostReplyForm slug={slug} />
    </Page>
  )
}

export default ReplyPage
