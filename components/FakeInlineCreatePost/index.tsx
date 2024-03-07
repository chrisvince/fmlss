import { ButtonBase, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'

import useUser from '../../utils/data/user/useUser'
import MobileContainer from '../MobileContainer'
import usePostBodyTextAreaPlaceholder from '../../utils/usePostBodyTextAreaPlaceholder'
import SignUpModal from '../SignUpModal'
import NewPostModal from '../NewPostModal'
import { NotesRounded } from '@mui/icons-material'

const FakeInlineCreatePost = () => {
  const { user } = useUser()
  const isLoggedIn = !!user?.data.id
  const [renderNewPostModal, setRenderNewPostModal] = useState(false)
  const [newPostModalOpen, setNewPostModalOpen] = useState(false)
  const [renderSignInModal, setRenderSignInModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const handleSignInModalClose = () => setShowSignInModal(false)
  const handleNewPostModalClose = () => setNewPostModalOpen(false)
  const placeholder = usePostBodyTextAreaPlaceholder()

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      setRenderSignInModal(true)
      setShowSignInModal(true)
      return
    }

    setRenderNewPostModal(true)
    setNewPostModalOpen(true)
  }

  return (
    <>
      <ButtonBase
        aria-label="Create post"
        onClick={handleButtonClick}
        sx={{
          ':active': { backgroundColor: 'unset' },
          display: 'block',
          width: '100%',
        }}
      >
        <Box aria-hidden="true" sx={{ pointerEvents: 'none' }}>
          <MobileContainer>
            <Box
              sx={{
                display: 'grid',
                alignItems: 'start',
                gridTemplateColumns: '1fr min-content',
                gap: 3,
                pb: 1,
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'min-content 1fr',
                  alignItems: 'start',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '40px',
                    justifyContent: 'center',
                  }}
                >
                  <NotesRounded color="action" />
                </Box>
                <Box sx={{ paddingTop: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.disabled',
                      textAlign: 'left',
                    }}
                  >
                    {placeholder}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <Typography
                  sx={{
                    backgroundColor: 'primary.main',
                    borderRadius: '100px',
                    color: 'primary.contrastText',
                    fontSize: '0.9285714285714286rem',
                    lineHeight: 1.75,
                    minWidth: '64px',
                    px: 1.25,
                    py: 0.5,
                    textAlign: 'center',
                  }}
                >
                  Post
                </Typography>
              </Box>
            </Box>
          </MobileContainer>
        </Box>
      </ButtonBase>
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

export default FakeInlineCreatePost
