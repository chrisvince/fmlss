import { MetadataRoute } from 'next'
import constants from '../../constants'
import generateSitemapsFromDbCollection from '../../utils/sitemap/generateSitemapsFromDbCollection'
import getDbSitemapDoc from '../../utils/sitemap/getDbSitemapDoc'

const { PEOPLE_SITEMAPS_COLLECTION } = constants

export const generateSitemaps = async () =>
  generateSitemapsFromDbCollection(PEOPLE_SITEMAPS_COLLECTION)

const sitemap = async ({
  id,
}: {
  id: string
}): Promise<MetadataRoute.Sitemap> => {
  const items = await getDbSitemapDoc(id, PEOPLE_SITEMAPS_COLLECTION)

  if (!items) {
    return []
  }

  return items.map(({ slug, lastModified }) => ({
    changeFrequency: 'never',
    lastModified: lastModified.toDate(),
    priority: 0.4,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/people/${slug}`,
  }))
}

export default sitemap
