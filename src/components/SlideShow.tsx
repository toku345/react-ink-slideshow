import React from 'react'
import { Box, Text, useApp } from 'ink'
import { Slide } from './Slide.js'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation.js'

interface SlideData {
  title?: string
  content: string
}

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
  const progress = ((currentSlide + 1) / slides.length) * 100

  return (
    <Box flexDirection="column" height="100%">
      {/* スライド本体 */}
      <Box flexGrow={1}>
        <Slide title={currentSlideData.title} content={currentSlideData.content} />
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
          <Text>
            {'━'.repeat(Math.floor((100 - progress) / 5))}
            <Text color="cyan">{'█'.repeat(Math.ceil(progress / 5))}</Text>
          </Text>
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
