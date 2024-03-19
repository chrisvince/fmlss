import { Box } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  censor: boolean
  children: ReactNode
}

const PostAttachmentsCensorWrapper = ({ censor, children }: Props) => {
  if (!censor) {
    return children
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ visibility: 'hidden' }}>{children}</Box>
      <Box
        sx={{
          backgroundColor: 'grey.100',
          bottom: 0,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      />
    </Box>
  )
}

export default PostAttachmentsCensorWrapper
