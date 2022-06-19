interface PropTypes {
  children: React.ReactNode
}

const Layout = ({ children }: PropTypes) => {
  return (
    <div
      style={{
        margin: '0 auto',
        maxWidth: 767,
      }}
    >
      {children}
    </div>
  )
}

export default Layout
