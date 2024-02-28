import { Typography } from '@mui/material'
import { useMemo } from 'react'
import constants from '../../constants'
import numeral from 'numeral'

const { POST_MAX_LENGTH } = constants

const POST_WARNING_LENGTH = POST_MAX_LENGTH - 80

export enum PostLengthStatusType {
  Warning = 'warning',
  Error = 'error',
  None = 'none',
}

const formatPostLength = (length: number | undefined) =>
  numeral(length ?? 0).format('0,0')

interface Props {
  textLength: number | undefined
}

const PostBodyCounter = ({ textLength = 0 }: Props) => {
  const postLengthStatus = useMemo(() => {
    if (textLength > POST_MAX_LENGTH) {
      return PostLengthStatusType.Error
    }

    if (textLength >= POST_WARNING_LENGTH) {
      return PostLengthStatusType.Warning
    }

    return PostLengthStatusType.None
  }, [textLength])

  const shouldRenderPostLength = textLength > POST_WARNING_LENGTH

  return (
    <Typography
      variant="caption"
      sx={{
        fontWeight:
          postLengthStatus === PostLengthStatusType.Warning ||
          postLengthStatus === PostLengthStatusType.Error
            ? 'bold'
            : undefined,
        color:
          postLengthStatus === PostLengthStatusType.Error
            ? 'error.main'
            : postLengthStatus === PostLengthStatusType.Warning
            ? 'warning.main'
            : undefined,
        opacity: shouldRenderPostLength ? 1 : 0,
      }}
    >
      {formatPostLength(textLength ?? 0)}/{formatPostLength(POST_MAX_LENGTH)}
    </Typography>
  )
}

export default PostBodyCounter
