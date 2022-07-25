import { Typography, SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { Box } from '@mui/system'
import CaptionLink from '../CaptionLink'

interface PropTypes {
  children: React.ReactNode
  href?: string
  icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string
  }
}

const PostCaption = ({ children, href, icon: Icon }: PropTypes) => {

  if (href) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <CaptionLink href={href}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {Icon && (
              <Icon sx={{ fontSize: '1em', marginRight: 0.5 }} />
            )}
            {children}
          </Box>
        </CaptionLink>
      </Box>
    )
  }

  return (
    <Typography
      variant="caption"
      component="div"
    >
      {children}
    </Typography>
  )
}

export default PostCaption
