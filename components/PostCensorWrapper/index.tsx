import { Button, Link, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { ReactNode, useState } from 'react'
import NextLink from 'next/link'
import { CensorType } from '../../types/CensorType'
import { CensorSource } from '../../types/CensorSource'

interface Props {
  censorSource: CensorSource
  censorType: CensorType
  children: ReactNode
}

const CENSOR_TYPE_COPY_MAP: Record<CensorType, string> = {
  [CensorType.AdultContent]: 'adult content',
  [CensorType.Offensive]: 'offensive',
}

const CENSOR_SOURCE_COPY_MAP: Record<CensorSource, string> = {
  [CensorSource.Community]: 'community',
  [CensorSource.Author]: 'author',
}

const PostCensorWrapper = ({ censorSource, censorType, children }: Props) => {
  const [censorBypassed, setCensorBypassed] = useState(false)
  const theme = useTheme()
  const padding = theme.spacing(2)
  const handleShowPostClick = () => setCensorBypassed(true)

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      {!censorBypassed && (
        <Box
          sx={{
            alignItems: 'center',
            backdropFilter: 'blur(9px)',
            bottom: `-${padding}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            justifyContent: 'center',
            left: `-${padding}`,
            position: 'absolute',
            right: `-${padding}`,
            top: `calc(-${padding} + 1px)`,
            px: 2,
          }}
        >
          <Box>
            <Typography variant="body2" align="center">
              This post was marked as {CENSOR_TYPE_COPY_MAP[censorType]} by the{' '}
              {CENSOR_SOURCE_COPY_MAP[censorSource]}.
            </Typography>
            <Typography
              align="center"
              color="action.active"
              component="p"
              variant="caption"
            >
              You can control what you see in your{' '}
              <Link
                component={NextLink}
                href="/settings#content"
                sx={{ color: 'inherit' }}
              >
                settings
              </Link>
              .
            </Typography>
          </Box>
          <Button variant="outlined" onClick={handleShowPostClick}>
            Show post
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default PostCensorWrapper
