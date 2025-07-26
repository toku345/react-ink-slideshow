import { Newline, Text } from 'ink'
import React from 'react'

export function processContent(content: string): React.JSX.Element {
  const lines = content.split('\n')
  let inCodeBlock = false
  const elements: React.ReactNode[] = []

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return
    }

    // 最初の行以外は改行を追加
    if (elements.length > 0) {
      elements.push(<Newline key={`newline-${index}-${line.slice(0, 10).replace(/\s/g, '_')}`} />)
    }

    if (inCodeBlock) {
      elements.push(
        <Text key={`line-${index}-${line.slice(0, 10).replace(/\s/g, '_')}`} color="green">
          {'  '}
          {line}
        </Text>,
      )
    } else if (line.startsWith('#')) {
      elements.push(
        <Text key={`line-${index}-${line.slice(0, 10).replace(/\s/g, '_')}`} bold color="cyan">
          {line}
        </Text>,
      )
    } else {
      elements.push(
        <Text key={`line-${index}-${line.slice(0, 10).replace(/\s/g, '_')}`}>{line}</Text>,
      )
    }
  })

  return <Text>{elements}</Text>
}
