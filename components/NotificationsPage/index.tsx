import constants from '../../constants'
import useNotifications from '../../utils/data/notifications/useNotifications'
import Page from '../Page'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarTopicsSection from '../SidebarTopicsSection'
import NotificationsList from '../NotificationsList'
import SidebarPeopleSection from '../SidebarPeopleSection'

const { TOPICS_ENABLED } = constants

const NotificationsPage = () => {
  const { notifications, isLoading, moreToLoad, loadMore } = useNotifications()

  return (
    <Page
      pageTitle="Notifications"
      rightPanelChildren={
        <>
          <SidebarPeopleSection />
          {TOPICS_ENABLED && <SidebarTopicsSection />}
          <SidebarHashtagsSection />
        </>
      }
      renderPageTitle
    >
      <NotificationsList
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
        notifications={notifications}
      />
    </Page>
  )
}

export default NotificationsPage
