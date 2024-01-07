import { Box } from '@mui/system'
import { TrackedMatch } from '../PostBodyTextArea'
import PostBodyAttachment from '../PostBodyAttachment'

interface Props {
  onClose?: (id: string) => void
  onError?: (id: string, error: Error) => void
  trackedMatches: TrackedMatch[]
}

const PostBodyAttachments = ({ onClose, onError, trackedMatches }: Props) => {
  if (trackedMatches.length <= 0) {
    return null
  }

  return (
    <Box>
      {trackedMatches.map(trackedMatch => (
        <PostBodyAttachment
          key={trackedMatch.url}
          onClose={() => onClose?.(trackedMatch.url)}
          onError={error => onError?.(trackedMatch.url, error)}
          trackedMatch={trackedMatch}
        />
      ))}
    </Box>
  )
}

export default PostBodyAttachments
