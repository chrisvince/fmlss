import { ReplyRounded } from '@mui/icons-material'
import { useState } from 'react'
import dynamic from 'next/dynamic'

import ActionButton from '../ActionButton'
const ReplyModal = dynamic(() => import('../ReplyModal'), {
  ssr: false,
})

interface PropTypes {
  slug: string
}

const ReplyButton = ({ slug }: PropTypes) => {
  const [replyModalOpen, setReplyModalOpen] = useState(false)

  const handleReplyModalClose = () => setReplyModalOpen(false)
  const handleReplyButtonClick = () => setReplyModalOpen(true)

  return (
    <>
      <ActionButton
        onClick={handleReplyButtonClick}
        text="Reply"
        icon={ReplyRounded}
      />
      {replyModalOpen && (
        <ReplyModal
          open={replyModalOpen}
          onClose={handleReplyModalClose}
          slug={slug}
        />
      )}
    </>
  )
}

export default ReplyButton
