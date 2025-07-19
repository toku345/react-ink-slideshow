import { Box, Text, useApp } from 'ink'
import React from 'react'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation.js'
import { Slide } from './Slide.js'
import { TitleSlide } from './TitleSlide.js'

interface BaseSlide {
  type?: 'title' | 'content'
}

interface TitleSlideData extends BaseSlide {
  type: 'title'
  title: string
  subtitle?: string
  author?: string
}

interface ContentSlideData extends BaseSlide {
  type?: 'content'
  title?: string
  content: string
}

type SlideData = TitleSlideData | ContentSlideData

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
          <Text>
            <Text color="cyan">{'█'.repeat(Math.ceil(progress / 5))}</Text>
            {'━'.repeat(Math.floor((100 - progress) / 5))}
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
