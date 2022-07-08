import numeral from 'numeral'

const formatCount = (number: number) => numeral(number).format('0,0')

export default formatCount
