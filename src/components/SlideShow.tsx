import { Box, Text, useApp, useStdout } from 'ink'
import React from 'react'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation.js'
import { useTimer } from '../hooks/useTimer.js'
import type { SlideData } from '../types/slide.js'
import { ProgressBar } from './ProgressBar.js'
import { Slide } from './Slide.js'
import { TimerDisplay } from './TimerDisplay.js'
import { TitleSlide } from './TitleSlide.js'

interface SlideShowProps {
  slides: SlideData[]
}

export const SlideShow: React.FC<SlideShowProps> = ({ slides }) => {
  const { exit } = useApp()
  const { stdout } = useStdout()
  const timer = useTimer()
  const { currentSlide } = useKeyboardNavigation(slides.length, exit, timer)

  if (slides.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">No slides available</Text>
      </Box>
    )
  }

  const currentSlideData = slides[currentSlide]

  const renderSlide = () => {
    if (currentSlideData.type === 'title') {
      return (
        <TitleSlide
          title={currentSlideData.title}
          subtitle={currentSlideData.subtitle}
          author={currentSlideData.author}
        />
      )
    }
    return <Slide title={currentSlideData.title} content={currentSlideData.content} />
  }

  const terminalHeight = stdout.rows || 30
  const terminalWidth = stdout.columns || 80
  const footerHeight = 7

  return (
    <Box flexDirection="column" height={terminalHeight} width={terminalWidth}>
      {/* スライド本体 */}
      <Box
        flexGrow={1}
        height={terminalHeight - footerHeight}
        width={terminalWidth}
        justifyContent="center"
      >
        {renderSlide()}
      </Box>

      {/* フッター */}
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
          <ProgressBar currentSlide={currentSlide} totalSlides={slides.length} />
        </Box>

        {/* タイマー表示 */}
        <Box marginBottom={1}>
          <TimerDisplay remainingSeconds={timer.remainingSeconds} isRunning={timer.isRunning} />
        </Box>

        {/* ナビゲーション情報 */}
        <Box justifyContent="space-between">
          <Text>
            Slide {currentSlide + 1} / {slides.length}
          </Text>
          <Text dimColor>← → Navigate | 0/9 First/Last | t Timer | r Reset | q Quit</Text>
        </Box>
      </Box>
    </Box>
  )
}
