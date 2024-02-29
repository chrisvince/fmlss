import { type PostAttachment as PostAttachmentType } from '../../types'
import PostAttachment from '../PostAttachment'
import { Box } from '@mui/system'

interface Props {
  attachments: PostAttachmentType[]
}

const PostAttachments = ({ attachments }: Props) => {
  if (!attachments.length) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {attachments.map(attachment => (
        <PostAttachment key={attachment.href} attachment={attachment} />
      ))}
    </Box>
  )
}

export default PostAttachments
