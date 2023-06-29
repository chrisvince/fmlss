import Head from 'next/head'
import constants from '../../constants'
import type { ReactNode } from 'react'
import PageTitle from '../SectionHeading'
import NestedLayout from '../NestedLayout'
import RightSideBar from '../RightSideBar'
import { useRouter } from 'next/router'
import PageBackButton from '../PageBackButton'

const { APP_URL, BRAND_NAME, TWITTER_USERNAME } = constants
const URL = process.env.VERCEL_URL ?? APP_URL
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

interface Props {
  article?: {
    publishedTime?: string
    modifiedTime?: string
    section?: string
    tags?: string[]
  }
  backButtonHref?: string
  backButtonText?: string
  children: ReactNode
  description?: string
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
  article = {},
  backButtonHref,
  backButtonText = 'Back',
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
        <meta property="og:url" content={`${URL}${urlPath ?? asPath}`} />
        <meta property="og:image" content={`${URL}/og-image.png`} />
        <meta property="og:image:secure_url" content={`${URL}/og-image.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={BRAND_NAME} />
        <meta property="twitter:image" content={`${URL}/twitter-image.png`} />
        <meta property="twitter:image:alt" content={BRAND_NAME} />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="twitter:description" content={description} />
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
        {article.tags?.length &&
          article.tags.map((tag, index) => (
            <meta key={`${tag}-${index}`} name="article:tag" content={tag} />
          ))}
      </Head>
      {layout === 'rightPanel' ? (
        <NestedLayout
          thinContainer={thinContainer}
          main={
            <>
              {backButtonHref && (
                <PageBackButton href={backButtonHref}>
                  {backButtonText}
                </PageBackButton>
              )}
              {renderPageTitle && <PageTitle>{pageTitle}</PageTitle>}
              {children}
            </>
          }
          rightPanelChildren={<RightSideBar>{rightPanelChildren}</RightSideBar>}
        />
      ) : (
        <>
          {backButtonHref && (
            <PageBackButton href={backButtonHref}>
              {backButtonText}
            </PageBackButton>
          )}
          {renderPageTitle && <PageTitle>{pageTitle}</PageTitle>}
          {children}
        </>
      )}
    </>
  )
}

export default Page
