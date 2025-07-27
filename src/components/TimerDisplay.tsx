import { Box, Text } from 'ink'
import React, { useEffect, useState } from 'react'

interface TimerDisplayProps {
  remainingSeconds: number
  isRunning: boolean
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingSeconds, isRunning }) => {
  const [isFlashing, setIsFlashing] = useState(false)

  useEffect(() => {
    if (remainingSeconds === 0) {
      const interval = setInterval(() => {
        setIsFlashing((prev) => !prev)
      }, 500)
      return () => clearInterval(interval)
    }
    setIsFlashing(false)
  }, [remainingSeconds])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const timeDisplay = formatTime(remainingSeconds)
  const statusText = isRunning ? '▶' : '⏸'
  const timeColor =
    remainingSeconds === 0 && isFlashing ? 'black' : remainingSeconds === 0 ? 'red' : 'green'

  return (
    <Box>
      <Text>
        Timer: {statusText}{' '}
        <Text color={timeColor} bold>
          {timeDisplay}
        </Text>
      </Text>
    </Box>
  )
}
