import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconTypeMap,
} from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface LeftNavigationListItemPropTypes {
  avatarText?: string
  currentPaths?: string[]
  exact?: boolean
  href: string
  icon?: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string
  }
  iconCurrent?: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string
  }
  primary: string
  secondary?: string | null
}

const includesAny = (href: string, currentPaths: string[], exact: boolean) =>
  currentPaths.some(currentPath =>
    exact ? href === currentPath : href.startsWith(currentPath)
  )

const LeftNavigationListItem = ({
  currentPaths,
  exact,
  href,
  icon: Icon,
  iconCurrent: IconCurrent,
  primary,
  secondary,
}: LeftNavigationListItemPropTypes) => {
  const { asPath: actualPath } = useRouter()

  const isCurrentLink = includesAny(actualPath, currentPaths ?? [href], !!exact)

  const textColor = isCurrentLink ? 'primary.main' : undefined
  const iconColor = isCurrentLink ? 'primary' : undefined

  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} href={href}>
        {Icon && (
          <ListItemIcon>
            {IconCurrent && isCurrentLink ? (
              <IconCurrent color={iconColor} />
            ) : (
              <Icon color={iconColor} />
            )}
          </ListItemIcon>
        )}
        <ListItemText
          sx={{
            '& .MuiListItemText-primary': {
              color: textColor,
              fontWeight: isCurrentLink ? 'bold' : undefined,
            },
            '& .MuiListItemText-secondary': {
              color: textColor,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          }}
          primary={primary}
          secondary={secondary}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default LeftNavigationListItem
