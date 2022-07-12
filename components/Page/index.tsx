import Head from 'next/head'
import constants from '../../constants'
import type { ReactNode } from 'react'
import PageTitle from '../PageTitle'

const { BRAND_NAME } = constants

const DEFAULT_DESCRIPTION = `${BRAND_NAME}, the nameless, faceless networking platform.`

interface PropTypes {
  children: ReactNode
  description?: string
  noPageTitle?: boolean
  pageTitle?: string
  title?: string
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
  title,
}: PropTypes) => {
  const renderTitle = ({ title, pageTitle }: RenderTitle) => {
    if (title) return title
    if (pageTitle) return `${BRAND_NAME} – ${pageTitle}`
    return BRAND_NAME
  }

  return (
    <>
      <Head>
        <title>{renderTitle({ title, pageTitle })}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {(!noPageTitle || !pageTitle) && (
          <PageTitle>{pageTitle!}</PageTitle>
        )}
        {children}
      </main>
    </>
  )
}

export default Page
