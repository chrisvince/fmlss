import { Typography } from '@mui/material'
import createPostBodyLinks from '../../utils/createPostBodyLinks'

interface Props {
  body: string
  id?: string
  size?: 'small' | 'large'
}

const PostBody = ({ body, id, size = 'small' }: Props) => {
  const typographyVariant = ({
    large: 'body1',
    small: 'body2',
  }[size] ?? 'body2') as 'body1' | 'body2'

  return (
    <Typography
      sx={{ whiteSpace: 'pre-wrap' }}
      variant={typographyVariant}
      component="p"
      id={id}
    >
      {createPostBodyLinks(body)}
    </Typography>
  )
}

export default PostBody
