import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import React from 'react'
import { processContent } from '../utils/contentProcessor.js'

/**
 * スライドコンポーネントのプロパティ
 */
interface SlideProps {
  /** スライドのタイトル */
  title?: string
  /** スライドの本文コンテンツ */
  content: string
  /** フォントサイズオプション ('normal' | 'large') */
  fontSize?: 'normal' | 'large'
}

export const Slide: React.FC<SlideProps> = ({ title, content, fontSize = 'normal' }) => {
  const processedLines = processContent(content, fontSize)

  return (
    <Box
      flexDirection="column"
      padding={2}
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      {title && (
        <Box marginBottom={1}>
          {fontSize === 'large' ? (
            <BigText text={title} font="chrome" />
          ) : (
            <Text bold color="yellow" underline>
              {title}
            </Text>
          )}
        </Box>
      )}
      <Box flexDirection="column" alignItems="center">
        {processedLines}
      </Box>
    </Box>
  )
}
