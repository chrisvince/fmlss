import { Typography } from '@mui/material'
import { useRouter } from 'next/router'

import { Hashtag } from '../../types'
import formatPostCount from '../../utils/formatting/formatPostCount'
import ListItemFrame from '../ListItemFrame'

type PropTypes = {
  hashtag: Hashtag
}

const MiniHashtagListItem = ({ hashtag }: PropTypes) => {
  const { push: navigate } = useRouter()
  const handleOpen = () => navigate(`/hashtag/${hashtag.data.hashtag}`)

  return (
    <ListItemFrame onOpen={handleOpen}>
      <Typography variant="body1" component="div">
        #{hashtag.data.hashtag}
      </Typography>
      <Typography variant="caption">
        {formatPostCount(hashtag.data.usageCount)}
      </Typography>
    </ListItemFrame>
  )
}

export default MiniHashtagListItem
