import { Box } from '@mui/system'

import SidebarSectionHeading from '../SidebarSectionHeading'
import SidebarPeopleList from '../SidebarPeopleList'
import usePopularPeople from '../../utils/data/people/usePopularPeople'

const SidebarPeopleSection = () => {
  const { isLoading, people } = usePopularPeople({
    swrConfig: {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    },
  })

  if (!isLoading && !people.length) return null

  return (
    <Box>
      <SidebarSectionHeading>Popular People</SidebarSectionHeading>
      <SidebarPeopleList people={people} isLoading={isLoading} />
    </Box>
  )
}

export default SidebarPeopleSection
