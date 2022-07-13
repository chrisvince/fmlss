import { Typography } from '@mui/material'
import { useRouter } from 'next/router'

import { Hashtag } from '../../types'
import formatCount from '../../utils/formatCount'
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
        {formatCount(hashtag.data.usageCount)} posts
      </Typography>
    </ListItemFrame>
  )
}

export default MiniHashtagListItem
