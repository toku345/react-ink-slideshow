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
    <Box flexDirection="column" padding={1}>
      {title && (
        <Box marginBottom={1}>
          <Text bold color="yellow" underline>
            {title}
          </Text>
        </Box>
      )}
      <Box flexDirection="column">{processedLines}</Box>
    </Box>
  )
}
