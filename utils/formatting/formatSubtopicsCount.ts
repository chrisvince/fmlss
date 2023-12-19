import formatCount from './formatCount'

const formatSubtopicsCount = (number: number) => {
  const s = number === 1 ? '' : 's'
  const formattedCount = formatCount(number)
  return `${formattedCount} subtopic${s}`
}

export default formatSubtopicsCount
