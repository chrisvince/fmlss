import Page from '../Page'
import Feed from '../Feed'
import ComposePostButton from '../ComposePostButton'

const HomePage = () => {
  return (
    <Page pageTitle="Home">
      <h1>Home</h1>
      <ComposePostButton />
      <Feed />
    </Page>
  )
}

export default HomePage
