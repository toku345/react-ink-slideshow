import React from 'react'
import { Box, Text } from 'ink'
import { render } from 'ink-testing-library'
import { describe, expect, it, vi } from 'vitest'
import { useKeyboardNavigation } from '../src/hooks/useKeyboardNavigation.js'
import type { UseTimerReturn } from '../src/hooks/useTimer.js'

// ink's useInput をモック
vi.mock('ink', async () => {
  const actual = await vi.importActual<typeof import('ink')>('ink')
  return {
    ...actual,
    useInput: vi.fn(),
  }
})

// テスト用コンポーネント
function TestComponent({ totalSlides, onExit, timer }: { totalSlides: number; onExit?: () => void; timer?: UseTimerReturn }) {
  const { currentSlide } = useKeyboardNavigation(totalSlides, onExit, timer)
  return (
    <Box>
      <Text>{`Current slide: ${currentSlide}`}</Text>
    </Box>
  )
}

describe('useKeyboardNavigation', () => {
  it('should start at slide 0', async () => {
    const { useInput } = await import('ink')
    vi.mocked(useInput).mockImplementation(() => {})

    const { lastFrame } = render(<TestComponent totalSlides={5} />)
    expect(lastFrame()).toContain('Current slide: 0')
  })

  it('should navigate to next slide on right arrow', async () => {
    const { useInput } = await import('ink')
    let inputHandler: any

    vi.mocked(useInput).mockImplementation((handler) => {
      inputHandler = handler
    })

    const { lastFrame, rerender } = render(<TestComponent totalSlides={5} />)
    expect(lastFrame()).toContain('Current slide: 0')

    // 右矢印キーを押す
    inputHandler('', { rightArrow: true })
    rerender(<TestComponent totalSlides={5} />)
    expect(lastFrame()).toContain('Current slide: 1')

    // もう一度右矢印キーを押す
    inputHandler('', { rightArrow: true })
    rerender(<TestComponent totalSlides={5} />)
    expect(lastFrame()).toContain('Current slide: 2')
  })

  it('should navigate to previous slide on left arrow', async () => {
    const { useInput } = await import('ink')
    let inputHandler: any

    vi.mocked(useInput).mockImplementation((handler) => {
      inputHandler = handler
    })

    const { lastFrame, rerender } = render(<TestComponent totalSlides={5} />)

    // まず右矢印キーで進む
    inputHandler('', { rightArrow: true })
    inputHandler('', { rightArrow: true })
    rerender(<TestComponent totalSlides={5} />)
    expect(lastFrame()).toContain('Current slide: 2')

    // 左矢印キーで戻る
    inputHandler('', { leftArrow: true })
    rerender(<TestComponent totalSlides={5} />)
    expect(lastFrame()).toContain('Current slide: 1')
  })

  it('should not go beyond last slide', async () => {
    const { useInput } = await import('ink')
    let inputHandler: any

    vi.mocked(useInput).mockImplementation((handler) => {
      inputHandler = handler
    })

    const { lastFrame, rerender } = render(<TestComponent totalSlides={3} />)

    // 最後のスライドに移動
    inputHandler('', { rightArrow: true })
    inputHandler('', { rightArrow: true })
    rerender(<TestComponent totalSlides={3} />)
    expect(lastFrame()).toContain('Current slide: 2')

    // さらに右矢印キーを押しても進まない
    inputHandler('', { rightArrow: true })
    rerender(<TestComponent totalSlides={3} />)
    expect(lastFrame()).toContain('Current slide: 2')
  })

  it('should not go before first slide', async () => {
    const { useInput } = await import('ink')
    let inputHandler: any

    vi.mocked(useInput).mockImplementation((handler) => {
      inputHandler = handler
    })

    const { lastFrame, rerender } = render(<TestComponent totalSlides={3} />)

    // 左矢印キーを押しても0より前には行かない
    inputHandler('', { leftArrow: true })
    rerender(<TestComponent totalSlides={3} />)
    expect(lastFrame()).toContain('Current slide: 0')
  })

  it('should jump to first slide on 0 key', async () => {
    const { useInput } = await import('ink')
    let inputHandler: any

    vi.mocked(useInput).mockImplementation((handler) => {
      inputHandler = handler
    })

    const { lastFrame, rerender } = render(<TestComponent totalSlides={5} />)

    // 途中のスライドに移動
    inputHandler('', { rightArrow: true })
    inputHandler('', { rightArrow: true })
    rerender(<TestComponent totalSlides={5} />)
    expect(lastFrame()).toContain('Current slide: 2')

    // 0キーで最初のスライドに戻る
    inputHandler('0', {})
    rerender(<TestComponent totalSlides={5} />)
    expect(lastFrame()).toContain('Current slide: 0')
  })

  it('should jump to last slide on 9 key', async () => {
    const { useInput } = await import('ink')
    let inputHandler: any

    vi.mocked(useInput).mockImplementation((handler) => {
      inputHandler = handler
    })

    const { lastFrame, rerender } = render(<TestComponent totalSlides={5} />)

    // 9キーで最後のスライドに移動
    inputHandler('9', {})
    rerender(<TestComponent totalSlides={5} />)
    expect(lastFrame()).toContain('Current slide: 4')
  })

  it('should call exit function on q key', async () => {
    const { useInput } = await import('ink')
    let inputHandler: any

    vi.mocked(useInput).mockImplementation((handler) => {
      inputHandler = handler
    })

    const mockExit = vi.fn()
    render(<TestComponent totalSlides={5} onExit={mockExit} />)

    // qキーで終了
    inputHandler('q', {})
    expect(mockExit).toHaveBeenCalled()
  })

  it('should toggle timer on t key', async () => {
    const { useInput } = await import('ink')
    let inputHandler: any

    vi.mocked(useInput).mockImplementation((handler) => {
      inputHandler = handler
    })

    const mockTimer: UseTimerReturn = {
      remainingSeconds: 300,
      isRunning: false,
      start: vi.fn(),
      stop: vi.fn(),
      toggle: vi.fn(),
      reset: vi.fn(),
    }

    render(<TestComponent totalSlides={5} timer={mockTimer} />)

    // tキーでタイマートグル
    inputHandler('t', {})
    expect(mockTimer.toggle).toHaveBeenCalled()
  })

  it('should reset timer on r key', async () => {
    const { useInput } = await import('ink')
    let inputHandler: any

    vi.mocked(useInput).mockImplementation((handler) => {
      inputHandler = handler
    })

    const mockTimer: UseTimerReturn = {
      remainingSeconds: 150,
      isRunning: true,
      start: vi.fn(),
      stop: vi.fn(),
      toggle: vi.fn(),
      reset: vi.fn(),
    }

    render(<TestComponent totalSlides={5} timer={mockTimer} />)

    // rキーでタイマーリセット
    inputHandler('r', {})
    expect(mockTimer.reset).toHaveBeenCalled()
  })
})