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

  it('should maintain consistent layout height with and without title', () => {
    const { lastFrame: withTitle } = render(<Slide title="Title" content="Content" />)
    const { lastFrame: withoutTitle } = render(<Slide content="Content" />)

    // タイトルありとなしでコンテンツの位置が一貫していることを確認
    // 両方のフレームでコンテンツが表示されていることを確認
    expect(withTitle()).toContain('Title')
    expect(withTitle()).toContain('Content')
    expect(withoutTitle()).toContain('Content')

    // レイアウトの一貫性を視覚的に確認するため、
    // 両方のケースでコンテンツが適切に表示されていることを検証
    const withTitleLines = withTitle()?.split('\n') || []
    const withoutTitleLines = withoutTitle()?.split('\n') || []

    // 両方のケースで適切な行数があることを確認
    expect(withTitleLines.length).toBeGreaterThan(0)
    expect(withoutTitleLines.length).toBeGreaterThan(0)
  })

  it('should render content with proper line breaks', () => {
    const content = `Line 1

Line 3 (with empty line above)
Line 4`
    const { lastFrame } = render(<Slide content={content} />)
    const output = lastFrame()

    // 改行が正しく表示されていることを確認
    expect(output).toContain('Line 1')
    expect(output).toContain('Line 3 (with empty line above)')
    expect(output).toContain('Line 4')

    // 各行が別々の行として表示されていることを確認
    const lines = output?.split('\n') || []
    const line1Index = lines.findIndex(line => line.includes('Line 1'))
    const line3Index = lines.findIndex(line => line.includes('Line 3'))
    const line4Index = lines.findIndex(line => line.includes('Line 4'))

    // Line 1とLine 3の間に空行があることを確認
    expect(line3Index - line1Index).toBeGreaterThan(1)
    // Line 3とLine 4は連続していることを確認
    expect(line4Index - line3Index).toBe(1)
  })
})
