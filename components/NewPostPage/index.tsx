import Page from '../Page'
import NewPostForm from '../NewPostForm'
import MobileContainer from '../MobileContainer'

const NewPostPage = () => (
  <Page pageTitle="Create a New Post" uiPageTitle="Post" thinContainer>
    <MobileContainer>
      <NewPostForm />
    </MobileContainer>
  </Page>
)

export default NewPostPage
