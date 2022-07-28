import { Button } from '@mui/material'

import usePost from '../../utils/data/post/usePost'
import Modal from '../Modal'
import PostItem from '../PostItem'
import PostReplyForm from '../PostReplyForm'

interface Props {
  open: boolean
  onClose: () => void
  slug: string
}

const ReplyModal = ({ onClose, open, slug }: Props) => {
  const { isLoading } = usePost(slug)

  return (
    <Modal
      isLoading={isLoading}
      onClose={onClose}
      open={open}
      title="Reply to Post"
      actions={(
        <Button variant="contained" onClick={onClose}>
          Post
        </Button>
      )}
    >
      <PostItem hideActionBar slug={slug} />
      <PostReplyForm slug={slug} />
    </Modal>
  )
}

export default ReplyModal
