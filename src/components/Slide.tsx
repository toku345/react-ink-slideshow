import { Box, Text } from 'ink'
import React from 'react'

interface SlideProps {
  title?: string
  content: string
}

export const Slide: React.FC<SlideProps> = ({ title, content }) => {
  const lines = content.split('\n')
  let inCodeBlock = false
  const processedLines: React.JSX.Element[] = []

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return
    }

    if (inCodeBlock) {
      processedLines.push(
        <Text key={`code-${index}`} color="green">
          {'  '}
          {line}
        </Text>,
      )
    } else if (line.startsWith('#')) {
      processedLines.push(
        <Text key={`heading-${index}`} bold color="cyan">
          {line}
        </Text>,
      )
    } else {
      processedLines.push(<Text key={`text-${index}`}>{line}</Text>)
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
      <Box flexDirection="column">{processedLines}</Box>
    </Box>
  )
}
