import { ButtonBase, Typography, useMediaQuery } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { useState } from 'react'

import useUser from '../../utils/data/user/useUser'
import MobileContainer from '../MobileContainer'
import usePostBodyTextAreaPlaceholder from '../../utils/usePostBodyTextAreaPlaceholder'
import SignUpModal from '../SignUpModal'
import NewPostModal from '../NewPostModal'
import { NotesRounded } from '@mui/icons-material'
import Link from 'next/link'

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
  const { breakpoints } = useTheme()
  const isMobileDevice = useMediaQuery(breakpoints.down('sm'))

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
        component={isMobileDevice ? Link : 'button'}
        href={isMobileDevice ? '/post/new' : undefined}
        onClick={!isMobileDevice ? handleButtonClick : undefined}
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
                <Box
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 1.25,
                    py: 0.5,
                    minWidth: '64px',
                    lineHeight: 1.75,
                    borderRadius: '100px',
                  }}
                >
                  Post
                </Box>
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
