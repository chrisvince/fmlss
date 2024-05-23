import { generateSitemaps } from '../sitemap'

export const revalidate = 3600

const resolveSitemap = (id: string) =>
  `<sitemap><loc>${`${process.env.NEXT_PUBLIC_APP_URL}/people/sitemap/${id}.xml`}</loc></sitemap>`

export const GET = async () => {
  const siteMapItems = await generateSitemaps()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${siteMapItems.map(({ id }) => resolveSitemap(id)).join('')}
    </sitemapindex>
  `

  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } })
}
