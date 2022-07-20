import formatCount from './formatCount'

const formatViewCount = (number: number) => {
  if (number === 0) return
  const s = number > 1 ? 's' : ''
  const formattedCount = formatCount(number)
  return `${formattedCount} view${s}`
}

export default formatViewCount
