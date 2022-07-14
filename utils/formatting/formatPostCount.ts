import formatCount from './formatCount'

const formatPostCount = (number: number) => {
  const s = number > 1 ? 's' : ''
  const formattedCount = formatCount(number)
  return `${formattedCount} post${s}`
}

export default formatPostCount
