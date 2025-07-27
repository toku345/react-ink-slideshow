import { Box, Text, useApp, useStdout } from 'ink'
import React, { useMemo } from 'react'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation.js'
import { useTimer } from '../hooks/useTimer.js'
import type { SlideData } from '../types/slide.js'
import { Footer } from './Footer.js'
import { Slide } from './Slide.js'
import { SlideContainer } from './SlideContainer.js'
import { TitleSlide } from './TitleSlide.js'

interface SlideShowProps {
  slides: SlideData[]
}

export const SlideShow: React.FC<SlideShowProps> = ({ slides }) => {
  const { exit } = useApp()
  const { stdout } = useStdout()
  const timer = useTimer()
  const { currentSlide } = useKeyboardNavigation(slides.length, exit, timer)

  // スライドコンテンツをメモ化して、タイマー更新時の再レンダリングを防ぐ
  const slideContent = useMemo(() => {
    if (slides.length === 0) {
      return null
    }
    const currentSlideData = slides[currentSlide]
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
  }, [currentSlide, slides])

  if (slides.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="red">No slides available</Text>
      </Box>
    )
  }

  const terminalHeight = stdout.rows || 30
  const terminalWidth = stdout.columns || 80
  const footerHeight = 7

  return (
    <Box flexDirection="column" height={terminalHeight} width={terminalWidth}>
      {/* スライド本体 */}
      <SlideContainer
        terminalHeight={terminalHeight}
        terminalWidth={terminalWidth}
        footerHeight={footerHeight}
      >
        {slideContent}
      </SlideContainer>

      {/* フッター */}
      <Footer currentSlide={currentSlide} totalSlides={slides.length} timer={timer} />
    </Box>
  )
}
