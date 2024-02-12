import {
  Facebook,
  LinkRounded,
  LogoutRounded,
  Twitter,
} from '@mui/icons-material'
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Link,
  ListItem,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'

import generateFacebookPostLink from '../../utils/generateFacebookPostLink'
import generateTweetPostLink from '../../utils/generateTweetPostLink'
import ActionButton from '../ActionButton'

interface Props {
  slug: string
}

const ShareButton = ({ slug }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCopiedText, setShowCopiedText] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const url = `https://${process.env.NEXT_PUBLIC_DOMAIN}/post/${slug}`

  const handleClick = () => setMenuOpen(current => !current)
  const handleMenuClose = () => setMenuOpen(false)

  const handleCopyUrlButton = () => {
    navigator.clipboard.writeText(url)
    setShowCopiedText(true)
  }

  useEffect(() => {
    if (!menuOpen) {
      const resetTextTimeout = setTimeout(() => {
        setShowCopiedText(false)
      }, 200)

      return () => {
        clearTimeout(resetTextTimeout)
      }
    }

    if (!showCopiedText) return

    const closeMenuTimeout = setTimeout(() => {
      setMenuOpen(false)
    }, 3000)

    const resetTextTimeout = setTimeout(() => {
      setShowCopiedText(false)
    }, 3200)

    return () => {
      clearTimeout(closeMenuTimeout)
      clearTimeout(resetTextTimeout)
    }
  }, [menuOpen, showCopiedText])

  const handleShareClick = async () => {
    setMenuOpen(false)
    try {
      await global.navigator.share({
        title: 'Fameless - Post',
        text: 'Check out this post on Fameless!',
        url,
      })
    } catch (error) {
      // no handle
    }
  }

  return (
    <>
      <ActionButton
        text="Share"
        icon={LogoutRounded}
        rotateIcon={270}
        onClick={handleClick}
        ref={buttonRef}
      />
      <Menu
        anchorEl={buttonRef.current}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{ dense: true }}
      >
        <MenuItem onClick={handleCopyUrlButton}>
          <ListItemIcon>
            <LinkRounded />
          </ListItemIcon>
          <ListItemText primary={showCopiedText ? 'Copied!' : 'Copy URL'} />
        </MenuItem>
        {!!global.navigator?.share && (
          <MenuItem onClick={handleShareClick}>
            <ListItemIcon>
              <LogoutRounded sx={{ transform: 'rotate(270deg)' }} />
            </ListItemIcon>
            <ListItemText>Share...</ListItemText>
          </MenuItem>
        )}
        <MenuItem disableGutters>
          <Link
            href={generateTweetPostLink(slug)}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
          >
            <ListItem>
              <ListItemIcon>
                <Twitter />
              </ListItemIcon>
              <ListItemText primary="Twitter" />
            </ListItem>
          </Link>
        </MenuItem>
        <MenuItem disableGutters>
          <Link
            href={generateFacebookPostLink(slug)}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
          >
            <ListItem>
              <ListItemIcon>
                <Facebook />
              </ListItemIcon>
              <ListItemText primary="Facebook" />
            </ListItem>
          </Link>
        </MenuItem>
      </Menu>
    </>
  )
}

export default ShareButton
