import { Box, Text } from 'ink'
import React from 'react'
import type { UseTimerReturn } from '../hooks/useTimer.js'
import { ProgressBar } from './ProgressBar.js'
import { TimerDisplay } from './TimerDisplay.js'

interface FooterProps {
  currentSlide: number
  totalSlides: number
  timer: UseTimerReturn
}

// フッターコンポーネントを分離してメモ化
// タイマー更新時にスライド本体が再レンダリングされるのを防ぐ
export const Footer: React.FC<FooterProps> = React.memo(({ currentSlide, totalSlides, timer }) => {
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

      {/* タイマー表示 */}
      <Box marginBottom={1}>
        <TimerDisplay remainingSeconds={timer.remainingSeconds} isRunning={timer.isRunning} />
      </Box>

      {/* ナビゲーション情報 */}
      <Box justifyContent="space-between">
        <Text>
          Slide {currentSlide + 1} / {totalSlides}
        </Text>
        <Text dimColor>← → Navigate | 0/9 First/Last | t Timer | r Reset | q Quit</Text>
      </Box>
    </Box>
  )
})
