import { Newline, Text } from 'ink'
import React from 'react'

export function processContent(content: string): React.JSX.Element {
  const lines = content.split('\n')
  let inCodeBlock = false
  let codeBlockStartIndex = -1
  const elements: React.ReactNode[] = []
  let elementIndex = 0

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        codeBlockStartIndex = index
      }
      inCodeBlock = !inCodeBlock
      return
    }

    // 最初の行以外は改行を追加
    if (elements.length > 0) {
      elements.push(<Newline key={`newline-${elementIndex++}`} />)
    }

    if (inCodeBlock) {
      elements.push(
        <Text key={`line-${elementIndex++}`} color="green">
          {'  '}
          {line}
        </Text>,
      )
    } else if (line.startsWith('#')) {
      elements.push(
        <Text key={`line-${elementIndex++}`} bold color="cyan">
          {line}
        </Text>,
      )
    } else {
      elements.push(<Text key={`line-${elementIndex++}`}>{line}</Text>)
    }
  })

  // 未閉じのコードブロックがある場合の警告
  if (inCodeBlock && process.env.NODE_ENV !== 'production') {
    console.warn(`Warning: Unclosed code block starting at line ${codeBlockStartIndex + 1}`)
  }

  return <Text>{elements}</Text>
}
