import { ReactNode } from 'react'

const relativeTime = new Intl.RelativeTimeFormat('en', { style: 'long' })

const formatRelativeDate = (date: number): ReactNode => {
  const oneMinuteAgo = new Date()
  oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1)

  const oneHourAgo = new Date()
  oneHourAgo.setHours(oneHourAgo.getHours() - 1)

  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const dateObj = new Date(date)

  if (dateObj > oneMinuteAgo) {
    return 'Just now'
  }

  if (dateObj > oneHourAgo) {
    return relativeTime.format(
      Math.round(-(Date.now() - date) / 1000 / 60),
      'minutes'
    )
  }

  if (dateObj > oneDayAgo) {
    return relativeTime.format(
      Math.round(-(Date.now() - date) / 1000 / 60 / 60),
      'hours'
    )
  }

  if (dateObj > oneWeekAgo) {
    return relativeTime.format(
      Math.round(-(Date.now() - date) / 1000 / 60 / 60 / 24),
      'days'
    )
  }

  const fomattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  })

  return (
    <>
      {fomattedDate}&ensp;{formattedTime}
    </>
  )
}

export default formatRelativeDate
