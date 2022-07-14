import { Typography } from '@mui/material'
import { useRouter } from 'next/router'

import { Hashtag } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import ListItemFrame from '../ListItemFrame'
import MiniListItem from '../MiniListItem'

type PropTypes = {
  hashtag: Hashtag
}

const MiniHashtagListItem = ({ hashtag }: PropTypes) => {
  const { push: navigate } = useRouter()
  const handleOpen = () => navigate(`/hashtag/${hashtag.data.hashtag}`)

  return (
    <ListItemFrame onOpen={handleOpen} mini>
      <MiniListItem
        leftText={`#${hashtag.data.hashtag}`}
        rightText={formatPostCount(hashtag.data.usageCount)}
      />
    </ListItemFrame>
  )
}

export default MiniHashtagListItem
