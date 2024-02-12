import { Box, ListItem, ListItemButton, ListItemText } from '@mui/material'
import Page from '../Page'
import ProfileEmailListItem from '../ProfileEmailListItem'
import ProfileList from '../ProfileList'
import ProfileListItem from '../ProfileListItem'
import { useAuthUser } from 'next-firebase-auth'
import ProfileToggleListItem from '../ProfileToggleListItem'
import useUser from '../../utils/data/user/useUser'
import { useRouter } from 'next/router'

const ProfilePage = () => {
  const { displayName, signOut } = useAuthUser()
  const { push } = useRouter()
  const { update, user } = useUser()

  const handleSignOutButtonClick = async () => {
    signOut()
    push('/')
  }

  const emailNotificationsLikes =
    user?.data.settings.notifications.email.likes ?? false

  const emailNotificationsReplies =
    user?.data.settings.notifications.email.replies

  const hideOffensiveContent = user?.data.settings.content.hideOffensiveContent
  const hideAdultContent = user?.data.settings.content.hideAdultContent

  const handleEmailNotificationsLikesClick = () => {
    update({ ['settings.notifications.email.likes']: !emailNotificationsLikes })
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
    <Page pageTitle="Profile" thinContainer renderPageTitle>
      <Box sx={{ pb: 4 }}>
        <ProfileList heading="Account" id="account">
          <ProfileListItem
            href="/profile/name"
            primaryText="Name"
            secondaryText={displayName}
          />
          <ProfileEmailListItem />
        </ProfileList>
        <ProfileList heading="Security" id="security">
          <ProfileListItem href="/profile/password" primaryText="Password" />
        </ProfileList>
        <ProfileList heading="Email Notifications" id="email-notifications">
          <ProfileToggleListItem
            checked={emailNotificationsLikes}
            onClick={handleEmailNotificationsLikesClick}
          >
            Likes
          </ProfileToggleListItem>
          <ProfileToggleListItem
            checked={emailNotificationsReplies}
            onClick={handleEmailNotificationsRepliesClick}
          >
            Replies
          </ProfileToggleListItem>
        </ProfileList>
        <ProfileList heading="Display" id="display">
          <ProfileListItem
            href="/profile/appearance"
            primaryText="Appearance"
            secondaryText={user?.data.settings.colorScheme}
          />
        </ProfileList>
        <ProfileList heading="Content" id="content">
          <ProfileToggleListItem
            checked={hideOffensiveContent}
            onClick={handleHideOffensiveContentClick}
          >
            Hide offensive content
          </ProfileToggleListItem>
          <ProfileToggleListItem
            checked={hideAdultContent}
            onClick={handleHideAdultContentClick}
          >
            Hide adult content
          </ProfileToggleListItem>
        </ProfileList>
        <ProfileList>
          <ListItem>
            <ListItemButton onClick={handleSignOutButtonClick}>
              <ListItemText primary="Sign out" />
            </ListItemButton>
          </ListItem>
        </ProfileList>
      </Box>
    </Page>
  )
}

export default ProfilePage
