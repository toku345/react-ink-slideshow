import { Newline, Text } from 'ink'
import React from 'react'

export function processContent(content: string): React.JSX.Element {
  const lines = content.split('\n')
  let inCodeBlock = false
  let codeBlockStartLine = -1
  const elements: React.ReactNode[] = []

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        codeBlockStartLine = index
      }
      inCodeBlock = !inCodeBlock
      return
    }

    // 最初の行以外は改行を追加
    if (elements.length > 0) {
      // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
      elements.push(<Newline key={`newline-${index}`} />)
    }

    if (inCodeBlock) {
      elements.push(
        // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
        <Text key={`line-${index}`} color="green">
          {'  '}
          {line}
        </Text>,
      )
    } else if (line.startsWith('#')) {
      elements.push(
        // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
        <Text key={`line-${index}`} bold color="cyan">
          {line}
        </Text>,
      )
    } else {
      // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
      elements.push(<Text key={`line-${index}`}>{line}</Text>)
    }
  })

  // 未閉じのコードブロックがある場合の警告
  // codeBlockStartLine !== -1 のチェックは論理的には不要だが、
  // 防御的プログラミングの観点から明示的にチェック
  if (inCodeBlock && process.env.NODE_ENV !== 'production' && codeBlockStartLine !== -1) {
    console.warn(`Warning: Unclosed code block starting at line ${codeBlockStartLine + 1}`)
  }

  return <Text>{elements}</Text>
}
