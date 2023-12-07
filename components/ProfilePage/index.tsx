import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import Page from '../Page'
import ProfileEmailListItem from '../ProfileEmailListItem'
import ProfileList from '../ProfileList'
import ProfileListItem from '../ProfileListItem'
import { useAuthUser } from 'next-firebase-auth'
import ProfileToggleListItem from '../ProfileToggleListItem'
import useUser from '../../utils/data/user/useUser'

const ProfilePage = () => {
  const authUser = useAuthUser()
  const handleSignOutButtonClick = authUser.signOut
  const { update, user } = useUser()

  const emailNotificationsLikes =
    user?.data.settings.notifications.email.likes ?? false

  const emailNotificationsReplies =
    user?.data.settings.notifications.email.replies

  const handleEmailNotificationsLikesClick = () => {
    update({ ['settings.notifications.email.likes']: !emailNotificationsLikes })
  }

  const handleEmailNotificationsRepliesClick = () => {
    update({
      ['settings.notifications.email.replies']: !emailNotificationsReplies,
    })
  }

  return (
    <Page pageTitle="Profile" thinContainer renderPageTitle>
      <ProfileList heading="Account">
        <ProfileListItem
          href="/profile/name"
          primaryText="Name"
          secondaryText={authUser.displayName}
        />
        <ProfileEmailListItem />
      </ProfileList>
      <ProfileList heading="Security">
        <ProfileListItem href="/profile/password" primaryText="Password" />
        <ListItem disableGutters>
          <ListItemButton onClick={handleSignOutButtonClick}>
            <ListItemText primary="Sign out" />
          </ListItemButton>
        </ListItem>
      </ProfileList>
      <ProfileList heading="Email Notifications">
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
    </Page>
  )
}

export default ProfilePage
