import { Newline, Text } from 'ink'
// @ts-ignore - ink-syntax-highlight パッケージの型定義がない場合があるため
import SyntaxHighlight from 'ink-syntax-highlight'
import React from 'react'

export function processContent(content: string): React.JSX.Element {
  const lines = content.split('\n')
  let inCodeBlock = false
  let codeBlockStartLine = -1
  let codeBlockContent: string[] = []
  let codeBlockLanguage = ''
  const elements: React.ReactNode[] = []

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        codeBlockStartLine = index
        // 言語を抽出（例: ```javascript -> javascript）
        codeBlockLanguage = line.slice(3).trim()
        codeBlockContent = []
      } else {
        // コードブロックの終了
        if (elements.length > 0) {
          // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
          elements.push(<Newline key={`newline-before-code-${codeBlockStartLine}`} />)
        }

        if (codeBlockLanguage && codeBlockContent.length > 0) {
          // 言語が指定されている場合はシンタックスハイライトを適用
          elements.push(
            // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
            <SyntaxHighlight
              key={`code-block-${codeBlockStartLine}`}
              code={codeBlockContent.join('\n')}
              language={codeBlockLanguage}
            />,
          )
        } else if (codeBlockContent.length > 0) {
          // 言語が指定されていない場合は従来通り緑色で表示
          codeBlockContent.forEach((codeLine, codeIndex) => {
            if (codeIndex > 0) {
              // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
              elements.push(<Newline key={`code-newline-${codeBlockStartLine}-${codeIndex}`} />)
            }
            elements.push(
              // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
              <Text key={`code-line-${codeBlockStartLine}-${codeIndex}`} color="green">
                {'  '}
                {codeLine}
              </Text>,
            )
          })
        }
      }
      inCodeBlock = !inCodeBlock
      return
    }

    if (inCodeBlock) {
      // コードブロック内のコンテンツを収集
      codeBlockContent.push(line)
    } else {
      // 最初の行以外は改行を追加
      if (elements.length > 0) {
        // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
        elements.push(<Newline key={`newline-${index}`} />)
      }

      if (line.startsWith('#')) {
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
