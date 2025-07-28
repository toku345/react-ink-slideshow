import { Box, Text } from 'ink'
import React, { useEffect, useRef, useState } from 'react'

interface OptimizedTimerDisplayProps {
  remainingSeconds: number
  isRunning: boolean
}

// 定数定義
const FLASH_INTERVAL_MS = 500

// 純粋関数としてコンポーネント外に移動
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// タイマー表示を独立したコンポーネントで管理
// 点滅アニメーションを最適化
export const OptimizedTimerDisplay: React.FC<OptimizedTimerDisplayProps> = React.memo(
  ({ remainingSeconds, isRunning }) => {
    const [isFlashing, setIsFlashing] = useState(false)
    const flashIntervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
      let isMounted = true

      if (remainingSeconds === 0 && isMounted) {
        try {
          flashIntervalRef.current = setInterval(() => {
            if (isMounted) {
              setIsFlashing((prev) => !prev)
            }
          }, FLASH_INTERVAL_MS)
        } catch (error) {
          // setIntervalが失敗した場合のフォールバック
          console.error('Failed to start flash interval:', error)
          setIsFlashing(false)
        }
      } else {
        if (flashIntervalRef.current) {
          try {
            clearInterval(flashIntervalRef.current)
          } catch (error) {
            // clearIntervalが失敗しても続行
            console.error('Failed to clear flash interval:', error)
          } finally {
            flashIntervalRef.current = null
          }
        }
        setIsFlashing(false)
      }

      return () => {
        isMounted = false
        if (flashIntervalRef.current) {
          try {
            clearInterval(flashIntervalRef.current)
          } catch (error) {
            console.error('Failed to clear flash interval on cleanup:', error)
          }
        }
      }
    }, [remainingSeconds])

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
