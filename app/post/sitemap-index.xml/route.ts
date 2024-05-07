import constants from '../../../constants'
import { generateSitemaps } from '../sitemap'

const { APP_URL } = constants

export const revalidate = 3600

const resolveSitemap = (id: string) =>
  `<sitemap><loc>${`${APP_URL}/post/sitemap/${id}.xml`}</loc></sitemap>`

export const GET = async () => {
  const siteMapItems = await generateSitemaps()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${siteMapItems.map(({ id }) => resolveSitemap(id)).join('')}
    </sitemapindex>
  `

  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } })
}
