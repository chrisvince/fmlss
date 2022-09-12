import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'
import PostPreview from '../PostPreview'
import getMetaFromUrl, { UrlMeta } from '../../utils/getMetaFromUrl'
import { PostPreview as PostPreviewType } from '../../types'

const mapUrlMetaToPostPreview = (
  meta: UrlMeta | undefined,
  url: string
): PostPreviewType => {
  const { href, host } = new URL(url)
  return {
    description: meta?.description,
    href,
    image: meta?.image ? {
      src: meta.image,
      alt: meta.title,
    } : undefined,
    subtitle: host,
    title: meta?.siteName,
  }
}

interface Props {
  onChange?: (postPreview: PostPreviewType) => void
  onClose?: (postPreview: PostPreviewType) => void
  url: string
}

const PostBodyTextAreaLinkPreview = ({ onChange, onClose, url }: Props) => {
  const [postPreview, setPostPreview] = useState<PostPreviewType | null>()
  const handlePostPreviewClose = () => {
    if (!postPreview) return
    onClose?.(postPreview)
    setPostPreview(null)
  }

  const fetchMeta = useCallback(async (href: string) => {
    const meta = await getMetaFromUrl(href)
    const postPreview = mapUrlMetaToPostPreview(meta, href)
    setPostPreview(postPreview)
  }, [])

  const debouncedFetchMeta = useMemo(
    () => debounce(fetchMeta, 1000),
    [fetchMeta]
  )

  useEffect(() => {
    debouncedFetchMeta(url)

    return () => {
      debouncedFetchMeta.cancel()
    }
  }, [debouncedFetchMeta, url])

  useEffect(() => {
    if (!postPreview) return
    onChange?.(postPreview)
  }, [onChange, postPreview])

  if (!postPreview) return null

  return (
    <PostPreview
      postPreview={postPreview}
      onClose={handlePostPreviewClose}
    />
  )
}

export default PostBodyTextAreaLinkPreview
