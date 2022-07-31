import numeral from 'numeral'

const formatCount = (number: number) => {
  if (number > 9999) {
    return numeral(number).format('0[.]0a').toUpperCase()
  }
  return numeral(number).format('0,0')
}

export default formatCount
