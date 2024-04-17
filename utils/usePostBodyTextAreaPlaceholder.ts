import useUserData from './data/user/useUserData'

export enum PostType {
  New = 'new',
  Reply = 'reply',
}

interface Props {
  postType?: PostType
}

const usePostBodyTextAreaPlaceholder = ({
  postType = PostType.New,
}: Props = {}) => {
  const { user } = useUserData({ skip: postType === PostType.Reply })
  const userFirstName = user?.data.firstName

  const newPost = `${
    userFirstName ? `${userFirstName}, w` : 'W'
  }hat's on your mind?`

  return postType === PostType.New ? newPost : 'Write a reply'
}

export default usePostBodyTextAreaPlaceholder
