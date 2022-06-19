interface PropTypes {
  children: React.ReactNode
}

const PostList = ({ children }: PropTypes) => {
  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      {children}
    </ul>
  )
}

export default PostList
