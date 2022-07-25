import formatCount from './formatCount'

const formatLikesCount = (number: number) => {
  const s = number === 1 ? '' : 's'
  const formattedCount = formatCount(number)
  return `${formattedCount} like${s}`
}

export default formatLikesCount
