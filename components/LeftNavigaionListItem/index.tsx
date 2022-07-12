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
  exact?: boolean
  href: string
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string
  }
  iconCurrent?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string
  }
  primary: string
  secondary?: string | null
}

const LeftNavigationListItem = ({
  exact,
  href,
  icon: Icon,
  iconCurrent: IconCurrent,
  primary,
  secondary,
}: LeftNavigationListItemPropTypes) => {
  const { asPath: currentPath } = useRouter()
  const isCurrentLink = exact
    ? currentPath === href
    : currentPath.includes(href)
  const textColor = isCurrentLink ? 'primary.main' : undefined
  const iconColor = isCurrentLink ? 'primary' : undefined

  return (
    <ListItem disablePadding>
      <Link href={href} passHref>
        <ListItemButton>
          <ListItemIcon>
            {(IconCurrent && isCurrentLink) ? (
              <IconCurrent color={iconColor} />
            ) : (
              <Icon color={iconColor} />
            )}
          </ListItemIcon>
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
