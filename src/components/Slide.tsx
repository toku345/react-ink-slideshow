import React from 'react'
import { Box, Text } from 'ink'

interface SlideProps {
  title?: string
  content: string
}

export const Slide: React.FC<SlideProps> = ({ title, content }) => {
  const lines = content.split('\n')
  let inCodeBlock = false
  const processedLines: JSX.Element[] = []

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return
    }

    if (inCodeBlock) {
      processedLines.push(
        <Text key={index} color="green">
          {'  '}{line}
        </Text>
      )
    } else if (line.startsWith('#')) {
      processedLines.push(
        <Text key={index} bold color="cyan">
          {line}
        </Text>
      )
    } else {
      processedLines.push(
        <Text key={index}>
          {line}
        </Text>
      )
    }
  })

  return (
    <Box flexDirection="column" padding={1}>
      {title && (
        <Box marginBottom={1}>
          <Text bold color="yellow" underline>
            {title}
          </Text>
        </Box>
      )}
      <Box flexDirection="column">
        {processedLines}
      </Box>
    </Box>
  )
}