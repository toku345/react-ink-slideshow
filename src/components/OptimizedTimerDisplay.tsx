import { Box, Text } from 'ink'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { FLASH_INTERVAL_MS } from '../constants/timer.js'

interface OptimizedTimerDisplayProps {
  remainingSeconds: number
  isRunning: boolean
}

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

    // 環境変数で点滅アニメーションを無効化できる
    const disableFlashing = process.env.DISABLE_TIMER_FLASH === 'true'

    useLayoutEffect(() => {
      let isMounted = true

      if (remainingSeconds === 0 && isMounted && !disableFlashing) {
        try {
          flashIntervalRef.current = setInterval(() => {
            if (isMounted) {
              setIsFlashing((prev) => !prev)
            }
          }, FLASH_INTERVAL_MS)
        } catch (error) {
          // setIntervalが失敗した場合のフォールバック
          console.error(
            'タイマー点滅アニメーションの開始に失敗しました。アニメーションは無効化されます:',
            error,
          )
          setIsFlashing(false)
        }
      } else {
        if (flashIntervalRef.current) {
          try {
            clearInterval(flashIntervalRef.current)
          } catch (error) {
            // clearIntervalが失敗しても続行
            console.error(
              '点滅アニメーションの停止処理で問題が発生しましたが、動作に影響はありません:',
              error,
            )
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
            console.error('クリーンアップ時の点滅アニメーション停止で問題が発生しました:', error)
          }
        }
      }
    }, [remainingSeconds, disableFlashing])

    const timeDisplay = formatTime(remainingSeconds)
    const statusText = isRunning ? '▶' : '⏸'
    const timeColor =
      remainingSeconds === 0 && isFlashing && !disableFlashing
        ? 'black'
        : remainingSeconds === 0
          ? 'red'
          : 'green'

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
