import { pipe } from 'ramda'

const removePosts = (str: string) => str.replaceAll('posts/', '')

const splitBySlash = (str: string) => str.split('/')

const getLastIfMany = (arr: string[]) =>
  arr.length > 1 ? arr[arr.length - 2] : null

export const getParentIdFromDbReference = (dbPath: string) =>
  pipe(
    removePosts,
    splitBySlash,
    getLastIfMany,
  )(dbPath)
