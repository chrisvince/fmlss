import formatCount from './formatCount'

const formatReplyCount = (number: number) => {
  const modifier = number > 1 ? 'ies' : 'y'
  const formattedCount = formatCount(number)
  return `${formattedCount} repl${modifier}`
}

export default formatReplyCount
