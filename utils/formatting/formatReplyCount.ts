import formatCount from './formatCount'

const formatReplyCount = (number: number) => {
  const modifier = number === 1 ? 'y' : 'ies'
  const formattedCount = formatCount(number)
  return `${formattedCount} repl${modifier}`
}

export default formatReplyCount
