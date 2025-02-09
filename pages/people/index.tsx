import { createPeopleSWRGetKey } from '../../utils/createCacheKeys'
import getSidebarDataServer, {
  SidebarResourceKey,
} from '../../utils/data/sidebar/getSidebarDataServer'
import { SWRConfig } from 'swr'
import PeoplePage from '../../components/PeoplePage'
import isInternalRequest from '../../utils/isInternalRequest'
import { PeopleSortMode } from '../../types/PeopleSortMode'
import getPeopleServer from '../../utils/data/people/getPeopleServer'
import { GetServerSideProps } from 'next'
import { unstable_serialize } from 'swr/infinite'
import handleSWRError from '../../utils/handleSWRError'

const SORT_MODE_MAP: {
  [key: string]: PeopleSortMode
} = {
  [PeopleSortMode.Latest]: PeopleSortMode.Latest,
  [PeopleSortMode.Popular]: PeopleSortMode.Popular,
}

interface Props {
  fallback: {
    [key: string]: unknown
  }
}

const PeopleIndex = ({ fallback }: Props) => {
  return (
    <SWRConfig value={{ fallback, onError: handleSWRError }}>
      <PeoplePage />
    </SWRConfig>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const sort = (query.sort as string) || PeopleSortMode.Popular
  const sortMode = SORT_MODE_MAP[sort] ?? PeopleSortMode.Popular
  const peopleCacheKey = createPeopleSWRGetKey({ sortMode })

  const sidebarDataPromise = getSidebarDataServer({
    exclude: [SidebarResourceKey.People],
  })

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise

    return {
      props: {
        fallback: sidebarFallbackData,
      },
    }
  }

  const [people, sidebarFallbackData] = await Promise.all([
    getPeopleServer({ sortMode }),
    sidebarDataPromise,
  ])

  return {
    props: {
      fallback: {
        [unstable_serialize(peopleCacheKey)]: [people],
        ...sidebarFallbackData,
      },
    },
  }
}

export default PeopleIndex
