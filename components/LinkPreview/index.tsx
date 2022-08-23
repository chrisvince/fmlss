import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'

import getMetaFromUrl, { UrlMeta } from '../../utils/getMetaFromUrl'
import PostCard from '../PostCard'

interface Props {
  url: string
}

const LinkPreview = ({ url }: Props) => {
  const { href, host } = new URL(url)
  const [meta, setMeta] = useState<UrlMeta>()

  const fetchMeta = useCallback(async () => {
    const meta = await getMetaFromUrl(href)
    setMeta(meta)
  }, [href])

  const debouncedFetchMeta = useMemo(
    () => debounce(fetchMeta, 1000),
    [fetchMeta],
  )

  useEffect(() => {
    debouncedFetchMeta()
  }, [debouncedFetchMeta])

  useEffect(() => {
    return () => {
      debouncedFetchMeta.cancel()
    }
  }, [debouncedFetchMeta])

  if (!meta) {
    return null
  }

  const { description, image, title, icon, siteName } = meta

  return (
    <PostCard
      href={href}
      title={siteName}
      subtitle={host}
      description={description}
      image={{
        src: image ?? icon,
        alt: title,
      }}
    />
  )
}

export default LinkPreview
