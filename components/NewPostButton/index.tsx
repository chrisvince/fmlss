import Button from '@mui/material/Button'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuthUser } from 'next-firebase-auth'
import SignUpModal from '../SignUpModal'

const NewPostModal = dynamic(() => import('../NewPostModal'), { ssr: false })

const NewPostButton = () => {
  const router = useRouter()
  const [renderNewPostModal, setRenderNewPostModal] = useState(false)
  const [newPostModalOpen, setNewPostModalOpen] = useState(false)
  const [renderSignInModal, setRenderSignInModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const user = useAuthUser()
  const isLoggedIn = !!user.id
  const handleSignInModalClose = () => setShowSignInModal(false)
  const handleNewPostModalClose = () => setNewPostModalOpen(false)

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      setRenderSignInModal(true)
      setShowSignInModal(true)
      return
    }

    setRenderNewPostModal(true)
    setNewPostModalOpen(true)
  }

  useEffect(() => {
    const handleRouteChangeComplete = () => setNewPostModalOpen(false)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  })

  const button = (
    <Button
      fullWidth
      onClick={handleButtonClick}
      size="large"
      sx={{ marginBottom: 2 }}
      variant="contained"
    >
      Post
    </Button>
  )

  return (
    <>
      {button}
      {renderNewPostModal && (
        <NewPostModal
          open={newPostModalOpen}
          onClose={handleNewPostModalClose}
        />
      )}
      {renderSignInModal && (
        <SignUpModal
          actionText="Sign up to post."
          onClose={handleSignInModalClose}
          open={showSignInModal}
        />
      )}
    </>
  )
}

export default NewPostButton
