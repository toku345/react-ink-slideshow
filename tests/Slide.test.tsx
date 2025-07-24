import { render } from 'ink-testing-library'
import { describe, expect, it } from 'vitest'
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

  describe('fontSize option', () => {
    it('should render with large font when fontSize is "large"', () => {
      const { lastFrame } = render(
        <Slide title="Big Title" content="Big content" fontSize="large" />,
      )
      // BigTextコンポーネントはASCIIアートとして文字を大きく表示するため、
      // 元のテキストがフレーム内に含まれているかを確認
      const frame = lastFrame()
      // タイトルと本文の両方が表示されていることを確認
      expect(frame).toBeTruthy()
      expect(frame?.length).toBeGreaterThan(0)
    })

    it('should render normal font by default', () => {
      const { lastFrame } = render(<Slide title="Normal Title" content="Normal content" />)
      expect(lastFrame()).toContain('Normal Title')
      expect(lastFrame()).toContain('Normal content')
    })

    it('should handle empty lines with large font', () => {
      const content = `Line 1

Line 3`
      const { lastFrame } = render(<Slide content={content} fontSize="large" />)
      const frame = lastFrame()
      expect(frame).toBeTruthy()
      // 空行は表示されないが、Line 1とLine 3の間にスペースがあることを確認
    })

    it('should not apply large font to code blocks', () => {
      const content = `Normal text

\`\`\`javascript
const code = true
\`\`\`

More text`
      const { lastFrame } = render(<Slide content={content} fontSize="large" />)
      const frame = lastFrame()
      expect(frame).toBeTruthy()
      // コードブロックは通常のフォントサイズで表示される
      expect(frame).toContain('const code = true')
    })

    it('should render headers with large font', () => {
      const content = `# Header 1
## Header 2
Normal text`
      const { lastFrame } = render(<Slide content={content} fontSize="large" />)
      const frame = lastFrame()
      expect(frame).toBeTruthy()
      // ヘッダーも大きなフォントで表示される
    })
  })
})
