import { Text } from 'ink'
import BigText from 'ink-big-text'
import React from 'react'

export interface ProcessedLine {
  key: string
  element: React.JSX.Element
}

export function processContent(
  content: string,
  fontSize: 'normal' | 'large' = 'normal',
): React.JSX.Element[] {
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
    const lineKey = `line-${lineNumber}-${line.slice(0, 10).replace(/\s/g, '_')}`
    lineNumber++

    if (inCodeBlock) {
      processedLines.push(
        <Text key={lineKey} color="green">
          {'  '}
          {line}
        </Text>,
      )
    } else if (line.startsWith('#')) {
      if (fontSize === 'large' && line.trim()) {
        processedLines.push(
          <BigText key={lineKey} text={line.replace(/^#+\s*/, '')} font="simple" />,
        )
      } else {
        processedLines.push(
          <Text key={lineKey} bold color="cyan">
            {line}
          </Text>,
        )
      }
    } else {
      if (fontSize === 'large') {
        if (line.trim()) {
          // 空でない行はBigTextで表示
          processedLines.push(<BigText key={lineKey} text={line} font="simple" />)
        } else {
          // 空行の場合は適切なスペーシングを確保
          processedLines.push(
            <Text key={lineKey}>{/* BigTextの高さに合わせたスペーシング */} </Text>,
          )
        }
      } else {
        processedLines.push(<Text key={lineKey}>{line}</Text>)
      }
    }
  })

  return processedLines
}
