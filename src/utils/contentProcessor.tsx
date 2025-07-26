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

  // 未閉じのコードブロックはエラーとして扱う
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Warning: Unclosed code block starting at line ${startIndex + 1}`)
  }

  // 未閉じのコードブロックは通常のテキストとして扱う
  return null
}

function renderElements(elements: ContentElement[]): React.ReactNode[] {
  return elements.flatMap((element, index) => {
    const rendered = renderElement(element, index)
    if (index > 0) {
      // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
      return [<Newline key={`newline-${index}`} />, rendered]
    }
    return [rendered]
  })
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
      return <Text key={`text-${index}`}>{element.content}</Text>

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

export function processContent(content: string): React.JSX.Element {
  const elements = parseContent(content)
  const rendered = renderElements(elements)
  return <Text>{rendered}</Text>
}
