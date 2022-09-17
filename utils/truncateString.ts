type TruncateString = (
  str: string | null | undefined,
  maxLength?: number,
) => string

const truncateString: TruncateString = (str, maxLength = 30) => {
  if (!str) return ''
  if (str.length <= maxLength) {
    return str
  }
  return str.slice(0, maxLength).trim() + '…'
}

export default truncateString
