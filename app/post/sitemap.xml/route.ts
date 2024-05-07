import constants from '../../../constants'
import { generateSitemaps } from '../sitemap'

const { APP_URL } = constants

export const revalidate = 3600 // cache for 1 hour

const resolveSitemap = (id: string) =>
  `<sitemap><loc>${`${APP_URL}/post/sitemap/${id}.xml`}</loc></sitemap>`

export const GET = async () => {
  console.log('GET!!!!!')
  const siteMapItems = await generateSitemaps()
  console.log('siteMapItems', siteMapItems)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${siteMapItems.map(({ id }) => resolveSitemap(id)).join('')}
    </sitemapindex>
  `

  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } })
}
