import { Box, Text, useApp } from 'ink'
import React from 'react'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation.js'
import type { SlideData } from '../types/slide.js'
import { ProgressBar } from './ProgressBar.js'
import { Slide } from './Slide.js'
import { TitleSlide } from './TitleSlide.js'

interface SlideShowProps {
  slides: SlideData[]
}

export const SlideShow: React.FC<SlideShowProps> = ({ slides }) => {
  const { exit } = useApp()
  const { currentSlide } = useKeyboardNavigation(slides.length, exit)

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

  return (
    <Box flexDirection="column" height={30}>
      {/* スライド本体 */}
      <Box flexGrow={1}>{renderSlide()}</Box>

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

        {/* ナビゲーション情報 */}
        <Box justifyContent="space-between">
          <Text>
            Slide {currentSlide + 1} / {slides.length}
          </Text>
          <Text dimColor>← → Navigate | 0/9 First/Last | q Quit</Text>
        </Box>
      </Box>
    </Box>
  )
}
