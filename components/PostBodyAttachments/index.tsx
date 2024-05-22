import { Box } from '@mui/system'
import PostBodyAttachment from '../PostBodyAttachment'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'

interface Props {
  closingDisabled?: boolean
  onClose?: (id: string) => void
  onError?: (id: string, error: Error) => void
  postAttachments: PostAttachmentInput[]
}

const PostBodyAttachments = ({
  closingDisabled = false,
  onClose,
  onError,
  postAttachments,
}: Props) => {
  if (postAttachments.length <= 0) {
    return null
  }

  return (
    <Box>
      {postAttachments.map(postAttachment => (
        <PostBodyAttachment
          closingDisabled={closingDisabled}
          key={postAttachment.url}
          onClose={() => onClose?.(postAttachment.url)}
          onError={error => onError?.(postAttachment.url, error)}
          postAttachment={postAttachment}
        />
      ))}
    </Box>
  )
}

export default PostBodyAttachments
