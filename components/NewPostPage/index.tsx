import Page from '../Page'
import NewPostForm from '../NewPostForm'
import MobileContainer from '../MobileContainer'

const NewPostPage = () => (
  <Page
    description="Join the conversation. Create a new post on Fameless."
    pageTitle="Create a New Post"
    thinContainer
    uiPageTitle="Post"
  >
    <MobileContainer>
      <NewPostForm />
    </MobileContainer>
  </Page>
)

export default NewPostPage
