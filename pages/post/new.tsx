import { AuthAction, withUser, withUserTokenSSR } from 'next-firebase-auth'
import NewPostPage from '../../components/NewPostPage'
import PageSpinner from '../../components/PageSpinner'

const NewPost = () => <NewPostPage />

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})()

export default withUser({
  LoaderComponent: PageSpinner,
  whenAuthed: AuthAction.RENDER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(NewPost)
