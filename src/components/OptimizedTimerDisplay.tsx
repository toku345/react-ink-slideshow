import { Box, Text } from 'ink'
import React, { useEffect, useRef, useState } from 'react'

interface OptimizedTimerDisplayProps {
  remainingSeconds: number
  isRunning: boolean
}

// タイマー表示を独立したコンポーネントで管理
// 点滅アニメーションを最適化
export const OptimizedTimerDisplay: React.FC<OptimizedTimerDisplayProps> = React.memo(
  ({ remainingSeconds, isRunning }) => {
    const [isFlashing, setIsFlashing] = useState(false)
    const flashIntervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
      if (remainingSeconds === 0) {
        flashIntervalRef.current = setInterval(() => {
          setIsFlashing((prev) => !prev)
        }, 500)
      } else {
        if (flashIntervalRef.current) {
          clearInterval(flashIntervalRef.current)
          flashIntervalRef.current = null
        }
        setIsFlashing(false)
      }

      return () => {
        if (flashIntervalRef.current) {
          clearInterval(flashIntervalRef.current)
        }
      }
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
  },
  // メモ化の比較関数を追加
  (prevProps, nextProps) => {
    // 秒数が同じで、動作状態も同じなら再レンダリングしない
    return (
      prevProps.remainingSeconds === nextProps.remainingSeconds &&
      prevProps.isRunning === nextProps.isRunning
    )
  },
)
