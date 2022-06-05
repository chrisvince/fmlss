type GeneratePostParentPath = (
  params: { [option: string]: string },
  depth: number
) => string | null

const generatePostParentPath: GeneratePostParentPath = (params, depth) => {
  if (depth === 0) return null
  const parentDepth = depth - 1
  return Array.from(Array(parentDepth)).reduce(
      (acc, _, index) => acc + `/posts/${params[`postId${index + 1}`]}`,
      `/posts/${params.postId0}`
  )
}

export default generatePostParentPath
