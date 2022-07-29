import { ReplyRounded } from '@mui/icons-material'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'

import ActionButton from '../ActionButton'
const ReplyModal = dynamic(() => import('../ReplyModal'), {
  ssr: false,
})

interface PropTypes {
  slug: string
}

const ReplyButton = ({ slug }: PropTypes) => {
  const [replyModalOpen, setReplyModalOpen] = useState(false)
  const { breakpoints } = useTheme()
  const linkToPage = useMediaQuery(breakpoints.down('sm'))

  const handleReplyModalClose = () => setReplyModalOpen(false)
  const handleReplyButtonClick = () => setReplyModalOpen(true)

  return (
    <>
      <ActionButton
        onClick={!linkToPage ? handleReplyButtonClick : undefined}
        href={linkToPage ? `/post/${slug}/reply` : undefined}
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
