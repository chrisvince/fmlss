import Page from '../Page'
import NewPostForm from '../NewPostForm'
import MobileContainer from '../MobileContainer'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import DiscardPostConfirmDialog from '../DiscardPostConfirmDialog'

const NewPostPage = () => {
  const [contentExists, setContentExists] = useState(false)
  const [showCloseConfirmDialog, setShowCloseConfirmDialog] =
    useState<boolean>(false)
  const routeChangeUrl = useRef<string>()
  const confirmClicked = useRef<boolean>(false)
  const handleContentExists = setContentExists
  const router = useRouter()

  const handleConfirmDiscard = async () => {
    confirmClicked.current = true
    setShowCloseConfirmDialog(false)
    if (!routeChangeUrl.current) return
    const routeChangeUrlCurrent = routeChangeUrl.current
    await router.push(routeChangeUrlCurrent)
    routeChangeUrl.current = undefined
    confirmClicked.current = false
  }

  const handleRouteChangeStart = useCallback(
    (url: string) => {
      if (!contentExists || confirmClicked.current) return
      routeChangeUrl.current = url
      setShowCloseConfirmDialog(true)
      router.events.emit('routeChangeError')
      throw 'Abort route change. Please ignore this error.'
    },
    [contentExists, router.events]
  )

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [contentExists, handleRouteChangeStart, router.events])

  return (
    <Page
      description="Join the conversation. Create a new post on Fameless."
      pageTitle="Post"
      renderPageTitle
      uiPageTitle="Post"
    >
      <MobileContainer>
        <NewPostForm onContentExists={handleContentExists} />
      </MobileContainer>
      <DiscardPostConfirmDialog
        onCancel={() => setShowCloseConfirmDialog(false)}
        onConfirm={handleConfirmDiscard}
        open={showCloseConfirmDialog}
      />
    </Page>
  )
}

export default NewPostPage
