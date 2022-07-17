import PostItem from '../PostItem'
import RepliesList from '../RepliesList'
import Page from '../Page'
import truncateString from '../../utils/truncateString'
import usePost from '../../utils/data/post/usePost'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'

type PropTypes = {
  slug: string
}

const PostPage = ({ slug }: PropTypes) => {
  const { post } = usePost(slug)
  const pageTitle = truncateString(post.data.body)

  return (
    <Page
      pageTitle={pageTitle}
      uiPageTitle="Post"
      rightPanelChildren={
        <>
          <MiniHashtagsSection />
          <MiniCategoriesSection />
        </>
      }
    >
      <PostItem slug={slug} />
      <RepliesList slug={slug} />
    </Page>
  )
}

export default PostPage
