import { render } from 'ink-testing-library'
import { describe, expect, it, vi } from 'vitest'
import { SlideShow } from '../src/components/SlideShow.js'
import type { SlideData } from '../src/types/slide.js'

// useStdoutのモック
vi.mock('ink', async () => {
  const actual = await vi.importActual('ink')
  return {
    ...actual,
    useStdout: () => ({
      stdout: {
        rows: 40,
        columns: 80,
      },
    }),
  }
})

const testSlides: SlideData[] = [
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

  it('should use terminal height for fullscreen display', () => {
    const { lastFrame } = render(<SlideShow slides={testSlides} />)
    const frame = lastFrame()
    
    // 全画面表示のテスト - フレームが存在し、コンテンツが表示されることを確認
    expect(frame).toBeTruthy()
    expect(frame).toContain('Welcome')
    expect(frame).toContain('This is the first slide')
  })
})
