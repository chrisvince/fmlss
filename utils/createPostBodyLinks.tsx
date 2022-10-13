import { extractHashtagsWithIndices } from '@draft-js-plugins/hashtag'
import { extractLinks } from '@draft-js-plugins/linkify'
import { Link as MuiLink } from '@mui/material'
import { pipe } from 'ramda'
import { ReactNode } from 'react'
import Link from 'next/link'

const InlineLink = ({
  children,
  href,
  newTab = false,
}: {
  children: string | ReactNode[]
  href: string
  newTab?: boolean
}) => {
  const link = (
    <MuiLink
      href={newTab ? href : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      sx={{
        textDecoration: 'none',
        color: 'secondary.main',
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
      target={newTab ? '_blank' : undefined}
    >
      {children}
    </MuiLink>
  )

  if (newTab) {
    return link
  }

  return (
    <Link href={href} passHref>
      <MuiLink
        sx={{
          textDecoration: 'none',
          color: 'secondary.main',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        {children}
      </MuiLink>
    </Link>
  )
}

const createUrlLinks = (body: string) => {
  const links = extractLinks(body)
  if (!links) return [body]

  const test = links.reduce((acc, match, index, arr) => {
    const previousLink = arr[index - 1]

    const before = body.slice(
      previousLink ? previousLink.lastIndex : 0,
      match.index
    )

    const isLast = index === arr.length - 1

    return [
      ...acc,
      before,
      <InlineLink
        href={match.url}
        key={`${match.url}-${index}`}
        newTab
      >
        {match.text}
      </InlineLink>,
      ...(isLast ? [body.slice(match.lastIndex, Infinity)] : []),
    ]
  }, [] as ReactNode[])

  return test
}

const createHashtagLinksNew = (body: string) => {
  const links = extractHashtagsWithIndices(body)
  console.log('links', links)
  if (!links.length) return [body]

  return links.reduce((acc, hashtagIndice, index, arr) => {
    const previousLink = arr[index - 1]
    const previousLinkEndIndex = previousLink?.indices[1]
    const [startIndex, endIndex] = hashtagIndice.indices
    const before = body.slice(previousLinkEndIndex ?? 0, startIndex)
    const isLast = index === arr.length - 1

    return [
      ...acc,
      before,
      <InlineLink
        href={`/hashtag/${encodeURIComponent(hashtagIndice.hashtag)}`}
        key={`${hashtagIndice.hashtag}-${index}`}
      >
        #{hashtagIndice.hashtag}
      </InlineLink>,
      ...(isLast ? [body.slice(endIndex, Infinity)] : []),
    ]
  }, [] as ReactNode[])
}

const createReactNodesStringTreater =
  (fn: (string: string) => ReactNode[]) => (reactNodes: ReactNode[]) =>
    reactNodes.reduce((acc, reactNode) => {
      if (typeof reactNode !== 'string') {
        return [...acc as ReactNode[], reactNode]
      }
      return [...acc as ReactNode[], ...fn(reactNode)]
    }, [] as ReactNode[])

const createPostBodyLinks = pipe(
  createHashtagLinksNew,
  createReactNodesStringTreater(createUrlLinks),
)

export default createPostBodyLinks
