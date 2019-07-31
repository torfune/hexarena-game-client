const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds - minutes * 60

  const formatted = {
    minutes,
    seconds: String(seconds).padStart(2, '0'),
  }

  return `${formatted.minutes}:${formatted.seconds}`
}

export default formatTime
