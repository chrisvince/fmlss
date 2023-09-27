const slugify = (str: string) => {
  let result = str
  result = result.trim()
  result = result.toLowerCase()
  result = result.replace(/[^A-Za-z0-9]+/g, '-')
  result = result.startsWith('-') ? result.slice(1) : result
  result = result.endsWith('-') ? result.slice(0, -1) : result
  return result
}

export default slugify
