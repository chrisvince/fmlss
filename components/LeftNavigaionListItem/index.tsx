import {
  Avatar,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconTypeMap,
} from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { Box } from '@mui/system'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface LeftNavigationListItemPropTypes {
  avatarText?: string
  currentPaths?: string[]
  exact?: boolean
  href: string
  icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string
  }
  iconCurrent?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string
  }
  primary: string
  secondary?: string | null
}

const includesAny = (
  href: string,
  currentPaths: string[],
  exact: boolean
) =>
  currentPaths.some(currentPath =>
    exact ? href === currentPath : href.startsWith(currentPath)
  )

const LeftNavigationListItem = ({
  avatarText,
  currentPaths,
  exact,
  href,
  icon: Icon,
  iconCurrent: IconCurrent,
  primary,
  secondary,
}: LeftNavigationListItemPropTypes) => {
  const { asPath: actualPath } = useRouter()

  const isCurrentLink = includesAny(
    actualPath,
    currentPaths ?? [href],
    !!exact
  )

  const textColor = isCurrentLink ? 'primary.main' : undefined
  const iconColor = isCurrentLink ? 'primary' : undefined

  return (
    <ListItem disablePadding>
      <Link href={href} passHref>
        <ListItemButton>
          {Icon && (
            <ListItemIcon>
              {(IconCurrent && isCurrentLink) ? (
                <IconCurrent color={iconColor} />
              ) : (
                <Icon color={iconColor} />
              )}
            </ListItemIcon>
          )}
          {avatarText && (
            <Box sx={{ minWidth: '56px' }}>
              <Avatar>
                {avatarText}
              </Avatar>
            </Box>
          )}
          <ListItemText
            sx={{
              '& .MuiListItemText-primary': {
                color: textColor,
                fontWeight: isCurrentLink ? 'bold' : undefined,
              },
              '& .MuiListItemText-secondary': {
                color: textColor,
              },
            }}
            primary={primary}
            secondary={secondary}
          />
        </ListItemButton>
      </Link>
    </ListItem>
  )
}

export default LeftNavigationListItem
