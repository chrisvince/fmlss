import { MetadataRoute } from 'next'
import constants from '../../constants'
import initFirebaseAdmin from '../../utils/initFirebaseAdmin'
import { SitemapItem } from '../../types/SitemapItem'
import generateSitemapsFromDbCollection from '../../utils/sitemap/generateSitemapsFromDbCollection'
import getDbSitemapDoc from '../../utils/sitemap/getDbSitemapDoc'

const { APP_URL, PEOPLE_SITEMAPS_COLLECTION } = constants

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
    changeFrequency: 'daily',
    lastModified: lastModified.toDate(),
    url: `${APP_URL}/people/${slug}`,
  }))
}

export default sitemap
