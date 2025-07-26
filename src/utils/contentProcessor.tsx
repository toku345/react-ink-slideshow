import { Text } from 'ink'
import React from 'react'
import SyntaxHighlight from 'ink-syntax-highlight'

export interface ProcessedLine {
  key: string
  element: React.JSX.Element
}

export function processContent(content: string): React.JSX.Element[] {
  const lines = content.split('\n')
  let inCodeBlock = false
  let codeBlockContent = ''
  let codeBlockLanguage = ''
  const processedLines: React.JSX.Element[] = []
  let lineNumber = 0

  lines.forEach((line) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // Starting a code block
        inCodeBlock = true
        codeBlockContent = ''
        // Extract language from ```javascript or ```js etc.
        codeBlockLanguage = line.slice(3).trim() || ''
      } else {
        // Ending a code block
        inCodeBlock = false
        const codeKey = `code-${lineNumber}-${codeBlockContent.slice(0, 10).replace(/\s/g, '_')}`
        lineNumber++
        
        if (codeBlockLanguage) {
          // Use syntax highlighting if language is specified
          processedLines.push(
            <SyntaxHighlight
              key={codeKey}
              code={codeBlockContent.trim()}
              language={codeBlockLanguage}
            />,
          )
        } else {
          // Fallback to plain green text if no language specified
          processedLines.push(
            <Text key={codeKey} color="green">
              {codeBlockContent.trim()}
            </Text>,
          )
        }
        codeBlockContent = ''
        codeBlockLanguage = ''
      }
      return
    }

    // 各行に一意のIDを生成（コンテンツと行番号を組み合わせ）
    const lineKey = `line-${lineNumber}-${line.slice(0, 10).replace(/\s/g, '_')}`
    lineNumber++

    if (inCodeBlock) {
      // Accumulate code block content
      if (codeBlockContent) {
        codeBlockContent += '\n'
      }
      codeBlockContent += line
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

  return processedLines
}
