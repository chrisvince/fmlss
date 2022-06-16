type TruncateString = (
  str: string,
  maxLength: number,
) => string

const truncateString: TruncateString = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str
  }
  return str.slice(0, maxLength).trim() + '…'
}

export default truncateString
