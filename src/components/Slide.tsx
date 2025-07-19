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

  let lineNumber = 0
  lines.forEach((line) => {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return
    }

    // 各行に一意のIDを生成（コンテンツと行番号を組み合わせ）
    const lineKey = `${lineNumber}-${line.slice(0, 10)}`
    lineNumber++

    if (inCodeBlock) {
      processedLines.push(
        <Text key={lineKey} color="green">
          {'  '}
          {line}
        </Text>,
      )
    } else if (line.startsWith('#')) {
      processedLines.push(
        <Text key={lineKey} bold color="cyan">
          {line}
        </Text>,
      )
    } else {
      processedLines.push(<Text key={lineKey}>{line}</Text>)
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
