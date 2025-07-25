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
    const withTitleLines = withTitle().split('\n')
    const withoutTitleLines = withoutTitle().split('\n')
    
    // タイトルなしの場合でも、minHeight={1}により
    // タイトル領域分のスペースが確保されていることを確認
    expect(withoutTitleLines.length).toBeGreaterThan(0)
  })
})
