import { render } from 'ink-testing-library'
import { describe, expect, it } from 'vitest'
import { SlideShow } from '../src/components/SlideShow.js'

const testSlides = [
  {
    title: 'Welcome',
    content: 'This is the first slide',
  },
  {
    title: 'Features',
    content: '- Feature 1\n- Feature 2\n- Feature 3',
  },
  {
    content: 'No title slide',
  },
]

describe('SlideShow', () => {
  it('should render the first slide initially', () => {
    const { lastFrame } = render(<SlideShow slides={testSlides} />)

    expect(lastFrame()).toContain('Welcome')
    expect(lastFrame()).toContain('This is the first slide')
    expect(lastFrame()).toContain('Slide 1 / 3')
  })

  it('should display slide navigation info', () => {
    const { lastFrame } = render(<SlideShow slides={testSlides} />)

    // ナビゲーション情報
    expect(lastFrame()).toContain('Slide 1 / 3')
    expect(lastFrame()).toContain('← → Navigate')
    expect(lastFrame()).toContain('q Quit')
  })

  it('should handle empty slides array gracefully', () => {
    const { lastFrame } = render(<SlideShow slides={[]} />)

    expect(lastFrame()).toContain('No slides available')
  })

  it('should display progress bar', () => {
    const { lastFrame } = render(<SlideShow slides={testSlides} />)

    // プログレスバーの存在を確認
    expect(lastFrame()).toMatch(/[━█]+/)
  })
})
