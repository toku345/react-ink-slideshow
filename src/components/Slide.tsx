import { Box, Text } from 'ink'
import React from 'react'
import { processContent } from '../utils/contentProcessor.js'

interface SlideProps {
  title?: string
  content: string
}

export const Slide: React.FC<SlideProps> = ({ title, content }) => {
  const processedLines = processContent(content)

  return (
    <Box flexDirection="column" padding={2} width="100%">
      {/* タイトル領域は常に一定の高さを確保し、レイアウトの一貫性を保つ */}
      <Box marginTop={2} marginBottom={1} minHeight={1}>
        {title && (
          <Text bold color="yellow" underline>
            {title}
          </Text>
        )}
      </Box>
      <Box flexDirection="column">{processedLines}</Box>
    </Box>
  )
}
