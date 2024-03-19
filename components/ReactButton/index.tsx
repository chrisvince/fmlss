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

const MenuIcon = ({
  selected,
  emoji,
  text,
}: {
  selected: boolean
  emoji: string
  text: string
}) => (
  <ListItemIcon
    aria-label={text}
    sx={{
      alignItems: 'center',
      backgroundColor: selected ? 'action.selected' : undefined,
      borderRadius: '50%',
      color: 'unset',
      display: 'flex',
      fontSize: '1.75em',
      height: 40,
      justifyContent: 'center',
      transition: 'transform 250ms ease',
      width: 40,
    }}
  >
    {!selected ? (
      emoji
    ) : (
      <>
        <div className="emoji">{emoji}</div>
        <HighlightOffRounded
          className="remove-reaction-icon"
          color="action"
          sx={{ fontSize: '1.82rem !important' }}
        />
      </>
    )}
  </ListItemIcon>
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
  reactionCount: number
}

const ReactButton = ({ onChange, postReaction, reactionCount }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const [reactionId, setReactionId] = useState<ReactionId | undefined>(
    postReaction ?? undefined
  )

  const [delayedReactionId, setDelayedReactionId] = useState<
    string | undefined
  >(postReaction ?? undefined)

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
      setDelayedReactionId(reactionId)
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
        count={reactionCount}
        icon={buttonIcon}
        onClick={handleClick}
        ref={buttonRef}
        text="React"
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
              px: 1,
            }}
          >
            {REACT_OPTIONS.map(item => {
              const { emoji, id, text } = item
              const selected = id === delayedReactionId

              return (
                <MenuItem
                  key={id}
                  onClick={handleReactionButtonClick(
                    !selected ? id : undefined
                  )}
                  sx={{
                    justifyContent: 'center',
                    px: 1,
                    ...(selected && {
                      '& .remove-reaction-icon': {
                        display: 'none',
                      },
                    }),
                    '&:hover': {
                      backgroundColor: 'unset',
                      ...(!selected
                        ? {
                            '& .MuiListItemIcon-root': {
                              transform: 'scale(1.3) rotate(7deg)',
                            },
                          }
                        : {
                            '& .emoji': {
                              display: 'none',
                            },
                            '& .remove-reaction-icon': {
                              display: 'block',
                            },
                          }),
                    },
                    '& .MuiListItemIcon-root': { minWidth: 'unset' },
                  }}
                >
                  <MenuIcon selected={selected} emoji={emoji} text={text} />
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
              const selected = id === delayedReactionId

              return (
                <MenuItem
                  aria-selected={selected}
                  key={id}
                  onClick={handleReactionButtonClick(
                    !selected ? id : undefined
                  )}
                  sx={{
                    px: 1,
                    gap: 1,
                    ...(selected && {
                      '& .remove-reaction-icon': {
                        display: 'none',
                      },
                    }),
                    '&:hover': {
                      ...(!selected
                        ? {}
                        : {
                            '& .emoji': {
                              display: 'none',
                            },
                            '& .remove-reaction-icon': {
                              display: 'block',
                            },
                          }),
                    },
                  }}
                >
                  <MenuIcon selected={selected} emoji={emoji} text={text} />
                  <ListItemText primary={text} sx={{ color: 'error.main' }} />
                </MenuItem>
              )
            })}
          </MenuList>
        </li>
      </Menu>
    </>
  )
}

export default ReactButton
