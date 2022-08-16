import Head from 'next/head'
import constants from '../../constants'
import type { ReactNode } from 'react'
import PageTitle from '../SectionHeading'
import NestedLayout from '../NestedLayout'
import RightSideBar from '../RightSideBar'

const { BRAND_NAME, DOMAIN, TWITTER_USERNAME } = constants

const DEFAULT_DESCRIPTION = `${BRAND_NAME}, the nameless, faceless networking platform.`

interface RenderTitle {
  title?: string
  pageTitle?: string
}

const renderTitle = ({ title, pageTitle }: RenderTitle) => {
  if (title) return title
  if (pageTitle) return `${BRAND_NAME} – ${pageTitle}`
  return BRAND_NAME
}

interface PropTypes {
  article?: {
    publishedTime?: string
    modifiedTime?: string
    section?: string
    tags?: string[]
  }
  children: ReactNode
  description?: string
  noPageTitle?: boolean
  pageTitle?: string
  rightPanelChildren?: ReactNode
  thinContainer?: boolean
  title?: string
  type?: string
  uiPageTitle?: string
  urlPath?: string
}

const Page = ({
  article = {},
  children,
  description = DEFAULT_DESCRIPTION,
  noPageTitle = false,
  pageTitle,
  rightPanelChildren,
  thinContainer = false,
  title,
  type,
  uiPageTitle,
  urlPath,
}: PropTypes) => {
  const uiTitle = uiPageTitle ?? pageTitle
  const renderUiTitle = !noPageTitle && uiTitle

  return (
    <>
      <Head>
        <title>{renderTitle({ title, pageTitle })}</title>
        <meta property="og:title" content={pageTitle ?? title} />
        {type && <meta property="og:type" content={type} />}
        <meta property="twitter:site" content={TWITTER_USERNAME} />
        <meta name="twitter:card" content="summary" />
        {urlPath && <meta property="og:url" content={`${DOMAIN}${urlPath}`} />}
        <meta property="og:image" content="/og-image.png" />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        {article.publishedTime && (
          <meta name="article:published_time" content={article.publishedTime} />
        )}
        {article.modifiedTime && (
          <meta name="article:modified_time" content={article.modifiedTime} />
        )}
        {article.section && (
          <meta name="article:section" content={article.section} />
        )}
        {article.tags?.length && article.tags.map((tag, index) => (
          <meta key={`${tag}-${index}`} name="article:tag" content={tag} />
        ))}
      </Head>
      <NestedLayout
        thinContainer={thinContainer}
        main={
          <>
            {renderUiTitle && <PageTitle>{uiTitle}</PageTitle>}
            {children}
          </>
        }
        rightPanelChildren={<RightSideBar>{rightPanelChildren}</RightSideBar>}
      />
    </>
  )
}

export default Page
