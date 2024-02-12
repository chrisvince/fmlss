import { HighlightOffRounded, MoodRounded } from '@mui/icons-material'
import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material'

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import ActionButton from '../ActionButton'
import reactions from '../../data/reactions'
import { ReactionOptions, ReactionId } from '../../types/Reaction'

const REACT_OPTIONS: ReactionOptions[] = reactions.filter(
  reaction =>
    ![ReactionId.Offensive, ReactionId.AdultContent].includes(reaction.id)
)

const REPORT_OPTIONS: ReactionOptions[] = reactions.filter(reaction =>
  [ReactionId.Offensive, ReactionId.AdultContent].includes(reaction.id)
)

const EmojiIcon = ({ emoji }: { emoji: ReactNode }) => (
  <Box
    sx={{ height: 21.42, width: 21.42, fontSize: '1.35em', lineHeight: 1.15 }}
  >
    {emoji}
  </Box>
)

interface Props {
  onChange: (reaction: ReactionId | undefined) => void
  postReaction?: ReactionId | null
}

const ReactButton = ({ onChange, postReaction }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const [reactionId, setReactionId] = useState<ReactionId | undefined>(
    postReaction ?? undefined
  )

  const [showRemoveReaction, setShowRemoveReaction] = useState<boolean>(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const handleClick = () => setMenuOpen(current => !current)
  const handleMenuClose = () => setMenuOpen(false)

  const handleReactionButtonClick = (newReactionId?: ReactionId) => () => {
    setReactionId(newReactionId)
    setMenuOpen(false)
    onChange(newReactionId)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowRemoveReaction(reactionId ? true : false)
      return
    }, 200)

    return () => {
      clearTimeout(timeout)
    }
  }, [reactionId])

  const buttonIcon = useMemo(() => {
    if (!reactionId) return MoodRounded
    const matchingReaction = reactions.find(option => option.id === reactionId)
    if (!matchingReaction) return MoodRounded
    // eslint-disable-next-line react/display-name
    return () => <EmojiIcon emoji={matchingReaction.emoji} />
  }, [reactionId])

  return (
    <>
      <ActionButton
        text="React"
        textBold
        icon={buttonIcon}
        onClick={handleClick}
        ref={buttonRef}
      />
      <Menu
        anchorEl={buttonRef.current}
        open={menuOpen}
        onClose={handleMenuClose}
        component="div"
        MenuListProps={{
          sx: { py: 0 },
        }}
      >
        <li>
          <MenuList
            dense
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
            }}
          >
            {REACT_OPTIONS.map(item => {
              const { emoji, id, text } = item

              return (
                <MenuItem
                  key={id}
                  onClick={handleReactionButtonClick(id)}
                  sx={{
                    justifyContent: 'center',
                    '&:hover': {
                      backgroundColor: 'unset',
                      '& .MuiListItemIcon-root': {
                        transform: 'scale(1.3) rotate(7deg)',
                      },
                    },
                    '& .MuiListItemIcon-root': { minWidth: 'unset' },
                  }}
                >
                  <ListItemIcon
                    aria-label={text}
                    sx={{
                      color: 'unset',
                      fontSize: '1.75em',
                      transition: 'transform 250ms ease',
                    }}
                  >
                    {emoji}
                  </ListItemIcon>
                </MenuItem>
              )
            })}
          </MenuList>
        </li>
        <Divider />
        <li>
          <MenuList dense>
            {REPORT_OPTIONS.map(item => {
              const { emoji, id, text } = item

              return (
                <MenuItem key={id} onClick={handleReactionButtonClick(id)}>
                  <ListItemIcon sx={{ color: 'unset', fontSize: '1.5em' }}>
                    {emoji}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ color: 'error.main' }} />
                </MenuItem>
              )
            })}
            {showRemoveReaction && (
              <MenuItem onClick={handleReactionButtonClick()}>
                <ListItemIcon>
                  <HighlightOffRounded />
                </ListItemIcon>
                <ListItemText primary="Remove reaction" />
              </MenuItem>
            )}
          </MenuList>
        </li>
      </Menu>
    </>
  )
}

export default ReactButton
