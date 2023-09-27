import { titleCase } from 'title-case'

const titlify = (str: string) => {
  let result = str
  result = result.trim()
  result = result.toLowerCase()
  result = result.replace(/[^A-Za-z0-9]+/g, ' ')
  result = titleCase(result)
  return result
}

export default titlify
