const checkPossibleMoreToLoad = (
  data: any[] | undefined,
  limit: number
): boolean => data?.at(-1)?.length === limit

export default checkPossibleMoreToLoad
