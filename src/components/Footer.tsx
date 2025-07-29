import { Box, Text, useInput } from 'ink'
import React from 'react'
import { useTimer } from '../hooks/useTimer.js'
import { OptimizedTimerDisplay } from './OptimizedTimerDisplay.js'
import { ProgressBar } from './ProgressBar.js'

interface FooterProps {
  currentSlide: number
  totalSlides: number
}

// フッターコンポーネントを分離してメモ化
// タイマー更新時にスライド本体が再レンダリングされるのを防ぐ
export const Footer: React.FC<FooterProps> = React.memo(({ currentSlide, totalSlides }) => {
  // タイマーをFooter内で直接管理し、親コンポーネントへの影響を防ぐ
  const timer = useTimer()

  // タイマー操作のキーボード入力をFooter内で処理
  useInput((input) => {
    if (input === 't') {
      timer.toggle()
    }
    if (input === 'r') {
      timer.reset()
    }
  })
  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderTop
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={2}
      paddingRight={2}
    >
      {/* プログレスバー */}
      <Box marginBottom={1}>
        <ProgressBar currentSlide={currentSlide} totalSlides={totalSlides} />
      </Box>

      {/* ナビゲーション情報 */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Text>
          Slide {currentSlide + 1} / {totalSlides}
        </Text>
        <Text dimColor>← → Navigate | 0/9 First/Last | t Timer | r Reset | q Quit</Text>
      </Box>

      {/* タイマー表示 */}
      <Box>
        <OptimizedTimerDisplay
          remainingSeconds={timer.remainingSeconds}
          isRunning={timer.isRunning}
        />
      </Box>
    </Box>
  )
})
