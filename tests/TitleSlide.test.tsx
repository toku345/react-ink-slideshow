import { render } from 'ink-testing-library'
import { describe, expect, it } from 'vitest'
import { TitleSlide } from '../src/components/TitleSlide.js'

describe('TitleSlide', () => {
  it('should render title', () => {
    const { lastFrame } = render(<TitleSlide title="Test" />)
    // BigTextはASCIIアートでレンダリングするので、出力が空でないことを確認
    const output = lastFrame()
    expect(output).toBeTruthy()
    expect(output.length).toBeGreaterThan(0)
  })

  it('should render title with subtitle', () => {
    const { lastFrame } = render(<TitleSlide title="Test" subtitle="A great subtitle" />)
    const output = lastFrame()
    expect(output).toBeTruthy()
    expect(output).toContain('A great subtitle')
  })

  it('should render title with author', () => {
    const { lastFrame } = render(<TitleSlide title="Test" author="John Doe" />)
    const output = lastFrame()
    expect(output).toBeTruthy()
    expect(output).toContain('発表者: John Doe')
  })

  it('should render all components when provided', () => {
    const { lastFrame } = render(
      <TitleSlide title="Test" subtitle="A great subtitle" author="John Doe" />,
    )
    const output = lastFrame()
    expect(output).toBeTruthy()
    expect(output).toContain('A great subtitle')
    expect(output).toContain('発表者: John Doe')
  })
})