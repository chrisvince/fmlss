import Head from 'next/head'
import constants from '../../constants'
import type { ReactNode } from 'react'
import PageTitle from '../PageTitle'
import NestedLayout from '../NestedLayout'
import RightSideBar from '../RightSideBar'
import { useRouter } from 'next/router'

const { APP_URL, BRAND_NAME, TWITTER_USERNAME } = constants
const DEFAULT_DESCRIPTION = `${BRAND_NAME}, the nameless, faceless networking platform.`
const APPLE_ICON_SIZES = [16, 32, 64, 128, 256, 512, 1024]

interface RenderTitle {
  title?: string
  pageTitle?: string
}

const renderTitle = ({ title, pageTitle }: RenderTitle) => {
  if (title) return title
  if (pageTitle) return `${BRAND_NAME} – ${pageTitle}`
  return BRAND_NAME
}

interface Props {
  aboveTitleContent?: ReactNode
  article?: {
    publishedTime?: string
    modifiedTime?: string
    section?: string
    tags?: string[]
  }
  children: ReactNode
  description?: string | null
  layout?: 'rightPanel' | 'none'
  pageTitle?: string
  renderPageTitle?: boolean
  rightPanelChildren?: ReactNode
  thinContainer?: boolean
  title?: string
  type?: string
  uiPageTitle?: string
  urlPath?: string
}

const Page = ({
  aboveTitleContent,
  article = {},
  children,
  description = DEFAULT_DESCRIPTION,
  layout = 'rightPanel',
  pageTitle,
  renderPageTitle = false,
  rightPanelChildren,
  thinContainer = false,
  title,
  type = 'website',
  urlPath,
}: Props) => {
  const { asPath } = useRouter()

  return (
    <>
      <Head>
        <title>{renderTitle({ title, pageTitle })}</title>
        <meta property="og:title" content={pageTitle ?? title} />
        <meta property="twitter:title" content={pageTitle ?? title} />
        {type && <meta property="og:type" content={type} />}
        <meta property="twitter:site" content={TWITTER_USERNAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:url" content={`${APP_URL}${urlPath ?? asPath}`} />
        <meta property="og:image" content={`${APP_URL}/og-image.png`} />
        <meta
          property="og:image:secure_url"
          content={`${APP_URL}/og-image.png`}
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={BRAND_NAME} />
        <meta
          property="twitter:image"
          content={`${APP_URL}/twitter-image.png`}
        />
        <meta property="twitter:image:alt" content={BRAND_NAME} />
        {description && <meta name="description" content={description} />}
        {description && <meta name="og:description" content={description} />}
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        <meta name="twitter:url" content={`${APP_URL}${urlPath ?? asPath}`} />
        {article.publishedTime && (
          <meta name="article:published_time" content={article.publishedTime} />
        )}
        {article.modifiedTime && (
          <meta name="article:modified_time" content={article.modifiedTime} />
        )}
        {article.section && (
          <meta name="article:section" content={article.section} />
        )}
        {article.tags?.length &&
          article.tags.map((tag, index) => (
            <meta key={`${tag}-${index}`} name="article:tag" content={tag} />
          ))}
        {APPLE_ICON_SIZES.map(size => (
          <link
            key={size}
            rel="apple-touch-icon"
            sizes={`${size}x${size}`}
            href={`icons/apple-icon-${size}.png`}
          />
        ))}
        <link
          rel="apple-touch-startup-image"
          href="icons/apple-icon-1024.png"
        />
        <meta name="apple-mobile-web-app-title" content={BRAND_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="manifest" href="manifest.json" />
      </Head>
      {layout === 'rightPanel' ? (
        <NestedLayout
          thinContainer={thinContainer}
          main={
            <>
              {aboveTitleContent}
              {renderPageTitle && <PageTitle>{pageTitle}</PageTitle>}
              {children}
            </>
          }
          rightPanelChildren={<RightSideBar>{rightPanelChildren}</RightSideBar>}
        />
      ) : (
        <>
          {aboveTitleContent}
          {renderPageTitle && <PageTitle>{pageTitle}</PageTitle>}
          {children}
        </>
      )}
    </>
  )
}

export default Page
