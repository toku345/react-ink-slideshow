import { Newline, Text } from 'ink'
import SyntaxHighlight from 'ink-syntax-highlight'
import React from 'react'

type TextLine = {
  type: 'text'
  content: string
}

type HeadingLine = {
  type: 'heading'
  content: string
}

type CodeBlock = {
  type: 'codeBlock'
  language?: string
  lines: string[]
}

type ContentElement = TextLine | HeadingLine | CodeBlock

function parseContent(content: string): ContentElement[] {
  const lines = content.split('\n')
  const elements: ContentElement[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const codeBlock = parseCodeBlock(lines, i)
      if (codeBlock) {
        elements.push(codeBlock.element)
        i = codeBlock.endIndex + 1
        continue
      }
    }

    if (line.startsWith('#')) {
      elements.push({ type: 'heading', content: line })
    } else {
      elements.push({ type: 'text', content: line })
    }

    i++
  }

  return elements
}

function parseCodeBlock(
  lines: string[],
  startIndex: number,
): { element: CodeBlock; endIndex: number } | null {
  const startLine = lines[startIndex]
  if (!startLine.startsWith('```')) return null

  const language = startLine.slice(3).trim()
  const codeLines: string[] = []
  let endIndex = startIndex

  for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i] === '```') {
      endIndex = i
      return {
        element: {
          type: 'codeBlock',
          language: language || undefined,
          lines: codeLines,
        },
        endIndex,
      }
    }
    codeLines.push(lines[i])
  }

  // 未閉じのコードブロックの警告
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Warning: Unclosed code block starting at line ${startIndex + 1}`)
  }

  // 未閉じのコードブロックもコードブロックとして扱う（より寛容な処理）
  return {
    element: {
      type: 'codeBlock',
      language: language || undefined,
      lines: codeLines,
    },
    endIndex: lines.length - 1,
  }
}

function renderElements(elements: ContentElement[]): React.ReactNode[] {
  return elements.reduce<React.ReactNode[]>((acc, element, index) => {
    const rendered = renderElement(element, index)

    // nullの場合は何も追加しない
    if (rendered === null) {
      return acc
    }

    // 最初の要素以外は改行を追加
    if (index > 0) {
      // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
      acc.push(<Newline key={`newline-${index}`} />)
    }

    acc.push(rendered)
    return acc
  }, [])
}

function renderElement(element: ContentElement, index: number): React.ReactNode | null {
  switch (element.type) {
    case 'heading':
      return (
        <Text key={`heading-${index}`} bold color="cyan">
          {element.content}
        </Text>
      )

    case 'text':
      return <Text key={`text-${index}`}>{renderTextWithFormatting(element.content)}</Text>

    case 'codeBlock':
      if (element.lines.length === 0) {
        return null
      }

      if (element.language) {
        return (
          <SyntaxHighlight
            key={`codeblock-${index}`}
            code={element.lines.join('\n')}
            language={element.language}
          />
        )
      } else {
        return element.lines.map((line, lineIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
          <React.Fragment key={`code-${index}-${lineIndex}`}>
            {lineIndex > 0 && <Newline />}
            <Text color="green">
              {'  '}
              {line}
            </Text>
          </React.Fragment>
        ))
      }
  }
}

function renderTextWithFormatting(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const boldRegex = /\*\*([^*]+)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  match = boldRegex.exec(text)
  while (match !== null) {
    // 通常のテキスト部分
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    // ボールドテキスト部分
    parts.push(
      <Text key={`bold-${match.index}`} bold>
        {match[1]}
      </Text>,
    )

    lastIndex = match.index + match[0].length
    match = boldRegex.exec(text)
  }

  // 最後の通常テキスト部分
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length === 0 ? text : parts
}

export function processContent(content: string): React.JSX.Element {
  const elements = parseContent(content)
  const rendered = renderElements(elements)
  return <Text>{rendered}</Text>
}
