import { Box, ListItem, ListItemButton, ListItemText } from '@mui/material'
import Page from '../Page'
import SettingsEmailListItem from '../SettingsEmailListItem'
import SettingsList from '../SettingsList'
import SettingsListItem from '../SettingsListItem'
import SettingsToggleListItem from '../SettingsToggleListItem'
import useUserData from '../../utils/data/user/useUserData'
import { useRouter } from 'next/router'
import { ColorSchemeSetting } from '../../types/ColorSchemeSetting'
import signOut from '../../utils/auth/signOut'
import useAuth from '../../utils/auth/useAuth'

const resolveColorSchemeName = (
  colorSchemeId: ColorSchemeSetting | undefined
) =>
  Object.keys(ColorSchemeSetting).find(key => {
    const value = ColorSchemeSetting[key as keyof typeof ColorSchemeSetting]
    return value === colorSchemeId
  })

const SettingsPage = () => {
  const { displayName } = useAuth() ?? {}
  const router = useRouter()
  const { update, user } = useUserData()

  const handleSignOutButtonClick = async () => {
    await signOut()
    router.reload()
  }

  const emailNotificationsLikes =
    user?.data.settings.notifications.email.likes ?? false

  const emailNotificationsReactions =
    user?.data.settings.notifications.email.reactions ?? false

  const emailNotificationsReplies =
    user?.data.settings.notifications.email.replies

  const hideOffensiveContent = user?.data.settings.content.hideOffensiveContent
  const hideAdultContent = user?.data.settings.content.hideAdultContent

  const handleEmailNotificationsLikesClick = () => {
    update({ ['settings.notifications.email.likes']: !emailNotificationsLikes })
  }

  const handleEmailNotificationsReactionsClick = () => {
    update({
      ['settings.notifications.email.reactions']: !emailNotificationsReactions,
    })
  }

  const handleEmailNotificationsRepliesClick = () => {
    update({
      ['settings.notifications.email.replies']: !emailNotificationsReplies,
    })
  }

  const handleHideOffensiveContentClick = () => {
    update({ ['settings.content.hideOffensiveContent']: !hideOffensiveContent })
  }

  const handleHideAdultContentClick = () => {
    update({ ['settings.content.hideAdultContent']: !hideAdultContent })
  }

  return (
    <Page pageTitle="Settings" thinContainer renderPageTitle>
      <Box sx={{ pb: 4 }}>
        <SettingsList heading="Account" id="account">
          <SettingsListItem
            href="/settings/name"
            primaryText="Name"
            secondaryText={displayName}
          />
          <SettingsEmailListItem />
        </SettingsList>
        <SettingsList heading="Security" id="security">
          <SettingsListItem href="/settings/password" primaryText="Password" />
        </SettingsList>
        <SettingsList heading="Email Notifications" id="email-notifications">
          <SettingsToggleListItem
            checked={emailNotificationsLikes}
            onClick={handleEmailNotificationsLikesClick}
          >
            Likes
          </SettingsToggleListItem>
          <SettingsToggleListItem
            checked={emailNotificationsReactions}
            onClick={handleEmailNotificationsReactionsClick}
          >
            Reactions
          </SettingsToggleListItem>
          <SettingsToggleListItem
            checked={emailNotificationsReplies}
            onClick={handleEmailNotificationsRepliesClick}
          >
            Replies
          </SettingsToggleListItem>
        </SettingsList>
        <SettingsList heading="Display" id="display">
          <SettingsListItem
            href="/settings/appearance"
            primaryText="Appearance"
            secondaryText={resolveColorSchemeName(
              user?.data.settings.colorScheme
            )}
          />
        </SettingsList>
        <SettingsList heading="Content" id="content">
          <SettingsToggleListItem
            checked={hideOffensiveContent}
            onClick={handleHideOffensiveContentClick}
          >
            Hide offensive content
          </SettingsToggleListItem>
          <SettingsToggleListItem
            checked={hideAdultContent}
            onClick={handleHideAdultContentClick}
          >
            Hide adult content
          </SettingsToggleListItem>
        </SettingsList>
        <SettingsList>
          <ListItem>
            <ListItemButton onClick={handleSignOutButtonClick}>
              <ListItemText primary="Sign out" />
            </ListItemButton>
          </ListItem>
        </SettingsList>
      </Box>
    </Page>
  )
}

export default SettingsPage
