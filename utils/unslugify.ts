import { titleCase } from 'title-case'

const unslugify = (str: string) => {
  let result = str
  result = result.replace(/-/g, ' ')
  result = titleCase(result)
  return result
}

export default unslugify
