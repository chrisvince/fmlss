import Link from 'next/link'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/system'
import dynamic from 'next/dynamic'
import { useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const NewPostModal = dynamic(() => import('../NewPostModal'), { ssr: false })

const NewPostButton = () => {
  const router = useRouter()
  const { breakpoints } = useTheme()
  const isMobileDevice = useMediaQuery(breakpoints.down('sm'))
  const [renderNewPostModal, setRenderNewPostModal] = useState(false)
  const [newPostModalOpen, setNewPostModalOpen] = useState(false)

  const handleNewPostModalClose = () => setNewPostModalOpen(false)

  const handleButtonClick = () => {
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
      size="large"
      variant="contained"
      sx={{ marginBottom: 2 }}
      onClick={!isMobileDevice ? handleButtonClick : undefined}
    >
      Post
    </Button>
  )

  if (isMobileDevice) {
    return (
      <Link href="/post/new" passHref>
        {button}
      </Link>
    )
  }

  return (
    <>
      {button}
      {renderNewPostModal && (
        <NewPostModal
          open={newPostModalOpen}
          onClose={handleNewPostModalClose}
        />
      )}
    </>
  )
}

export default NewPostButton
