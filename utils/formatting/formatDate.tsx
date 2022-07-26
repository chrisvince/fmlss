const formatDate = (date: string) => {
  if (!date) return null
  const dateObj = new Date(date)
  const fomattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  })
  return <>{fomattedDate}&ensp;{formattedTime}</>
}

export default formatDate
