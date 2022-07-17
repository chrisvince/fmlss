import Head from 'next/head'
import constants from '../../constants'
import type { ReactNode } from 'react'
import PageTitle from '../PageTitle'
import NestedLayout from '../NestedLayout'
import RightSideBar from '../RightSideBar'

const { BRAND_NAME } = constants

const DEFAULT_DESCRIPTION = `${BRAND_NAME}, the nameless, faceless networking platform.`

interface PropTypes {
  children: ReactNode
  description?: string
  noPageTitle?: boolean
  pageTitle?: string
  rightPanelChildren?: ReactNode
  title?: string
  uiPageTitle?: string
}

interface RenderTitle {
  title?: string
  pageTitle?: string
}

const Page = ({
  children,
  description = DEFAULT_DESCRIPTION,
  noPageTitle = false,
  pageTitle,
  rightPanelChildren,
  title,
  uiPageTitle,
}: PropTypes) => {
  const renderTitle = ({ title, pageTitle }: RenderTitle) => {
    if (title) return title
    if (pageTitle) return `${BRAND_NAME} – ${pageTitle}`
    return BRAND_NAME
  }
  const uiTitle = uiPageTitle ?? pageTitle
  const renderUiTitle = !noPageTitle && uiTitle

  return (
    <>
      <Head>
        <title>{renderTitle({ title, pageTitle })}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NestedLayout
        main={
          <>
            {renderUiTitle && <PageTitle>{uiTitle}</PageTitle>}
            {children}
          </>
        }
        rightPanelChildren={
          <RightSideBar>
            {rightPanelChildren}
          </RightSideBar>
        }
      />
      <main></main>
    </>
  )
}

export default Page
