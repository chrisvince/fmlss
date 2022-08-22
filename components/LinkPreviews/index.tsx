import { Box } from '@mui/system'
import { memo, useState } from 'react'
import LinkPreview from '../LinkPreview'

interface Props {
  links: {
    url: string
  }[] | null
}

const checkPropsEquality = (
  prevProps: Readonly<Props>,
  nextProps: Readonly<Props>,
): boolean => {
  if (!prevProps.links?.length && !nextProps.links?.length) {
    return true
  }

  if (prevProps.links?.length !== nextProps.links?.length) {
    return false
  }

  const equal = nextProps.links?.every(({ url }, index) => {
    const nextHref = new URL(url).href
    const prevUrl = prevProps.links?.[index].url

    if (!prevUrl) {
      return false
    }

    const prevHref = new URL(prevUrl).href
    return nextHref === prevHref
  })
  return equal ?? false
}

const LinkPreviews = memo(({ links = [] }: Props) => {
  useState()
  if (!links?.length) {
    return null
  }
  return (
    <Box>
      {links.map(({ url }) => (
        <LinkPreview key={url} url={url} />
      ))}
    </Box>
  )
}, checkPropsEquality)

LinkPreviews.displayName = 'LinkPreviews'

export default LinkPreviews
