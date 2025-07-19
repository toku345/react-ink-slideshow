import { describe, it, expect } from 'vitest'
import React from 'react'
import { render } from 'ink-testing-library'
import { Slide } from '../src/components/Slide.js'

describe('Slide', () => {
  it('should render text content', () => {
    const { lastFrame } = render(<Slide content="Hello World" />)
    expect(lastFrame()).toContain('Hello World')
  })

  it('should render multiple lines of text', () => {
    const content = `Line 1
Line 2
Line 3`
    const { lastFrame } = render(<Slide content={content} />)
    expect(lastFrame()).toContain('Line 1')
    expect(lastFrame()).toContain('Line 2')
    expect(lastFrame()).toContain('Line 3')
  })

  it('should render code blocks with proper formatting', () => {
    const content = `# Title

Here is some code:

\`\`\`javascript
const greeting = "Hello"
console.log(greeting)
\`\`\`

That's all!`

    const { lastFrame } = render(<Slide content={content} />)
    expect(lastFrame()).toContain('# Title')
    expect(lastFrame()).toContain('const greeting = "Hello"')
    expect(lastFrame()).toContain("That's all!")
  })

  it('should render with title when provided', () => {
    const { lastFrame } = render(<Slide title="My Slide" content="Content here" />)
    expect(lastFrame()).toContain('My Slide')
    expect(lastFrame()).toContain('Content here')
  })
})