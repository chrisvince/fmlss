type GenerateWildcardPath = (
  depth: number
) => string

const generateWildcardPath: GenerateWildcardPath = (depth) =>
  Array.from(Array(depth)).reduce(
      (acc, _, index) => acc + `/posts/{postId${index + 1}}`,
      '/posts/{postId0}'
  )

export default generateWildcardPath
