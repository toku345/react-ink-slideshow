import React from 'react'
import { describe, expect, it } from 'vitest'
import { processContent } from '../src/utils/contentProcessor.js'

describe('processContent', () => {
  it('should process plain text', () => {
    const content = 'Hello World'
    const result = processContent(content)
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('Text')
    expect(result[0].props.children).toBe('Hello World')
  })

  it('should process headers with cyan color', () => {
    const content = '# Header 1'
    const result = processContent(content)
    expect(result).toHaveLength(1)
    expect(result[0].props.color).toBe('cyan')
    expect(result[0].props.bold).toBe(true)
    expect(result[0].props.children).toBe('# Header 1')
  })

  it('should process code blocks with language', () => {
    const content = `\`\`\`javascript
const greeting = "Hello"
console.log(greeting)
\`\`\``
    const result = processContent(content)
    expect(result).toHaveLength(1)
    expect(result[0].type.name).toBe('SyntaxHighlight')
    expect(result[0].props.code).toBe('const greeting = "Hello"\nconsole.log(greeting)')
    expect(result[0].props.language).toBe('javascript')
  })

  it('should process code blocks without language as plain green text', () => {
    const content = `\`\`\`
some code here
\`\`\``
    const result = processContent(content)
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('Text')
    expect(result[0].props.color).toBe('green')
    expect(result[0].props.children).toBe('some code here')
  })

  it('should process mixed content', () => {
    const content = `# Title

Some text

\`\`\`typescript
interface User {
  name: string
}
\`\`\`

More text`
    const result = processContent(content)
    
    // Should have: header, empty line, text, empty line, code block, empty line, text
    expect(result.length).toBeGreaterThan(0)
    
    // Check header
    const header = result.find(el => el.props.children === '# Title')
    expect(header).toBeDefined()
    expect(header?.props.color).toBe('cyan')
    
    // Check code block
    const codeBlock = result.find(el => el.type.name === 'SyntaxHighlight')
    expect(codeBlock).toBeDefined()
    expect(codeBlock?.props.language).toBe('typescript')
  })

  it('should handle multiple code blocks', () => {
    const content = `\`\`\`js
const a = 1
\`\`\`

\`\`\`python
print("Hello")
\`\`\``
    const result = processContent(content)
    
    const codeBlocks = result.filter(el => el.type.name === 'SyntaxHighlight')
    expect(codeBlocks).toHaveLength(2)
    expect(codeBlocks[0].props.language).toBe('js')
    expect(codeBlocks[1].props.language).toBe('python')
  })
})