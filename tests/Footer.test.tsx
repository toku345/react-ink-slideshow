import React from 'react'
import { render } from 'ink-testing-library'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { Footer } from '../src/components/Footer.js'
import * as useTimerModule from '../src/hooks/useTimer.js'

// useTimerフックをモック
vi.mock('../src/hooks/useTimer.js')

describe('Footer', () => {
  const mockTimer = {
    remainingSeconds: 300,
    isRunning: false,
    start: vi.fn(),
    stop: vi.fn(),
    toggle: vi.fn(),
    reset: vi.fn(),
  }

  // 各テストの前にモックをセットアップ
  beforeEach(() => {
    vi.mocked(useTimerModule.useTimer).mockReturnValue(mockTimer)
  })

  it('現在のスライド番号と総数を表示する', () => {
    const { lastFrame } = render(
      <Footer currentSlide={2} totalSlides={5} />,
    )

    expect(lastFrame()).toContain('Slide 3 / 5')
  })

  it('ナビゲーションヘルプを表示する', () => {
    const { lastFrame } = render(
      <Footer currentSlide={0} totalSlides={10} />,
    )

    const frame = lastFrame()
    expect(frame).toContain('← → Navigate')
    expect(frame).toContain('0/9 First/Last')
    expect(frame).toContain('t Timer')
    expect(frame).toContain('r Reset')
    expect(frame).toContain('q Quit')
  })

  it('プログレスバーを表示する', () => {
    const { lastFrame } = render(
      <Footer currentSlide={0} totalSlides={4} />,
    )

    // プログレスバーの存在を確認（シアン色のブロック）
    expect(lastFrame()).toMatch(/█/)
  })

  it('タイマー表示を含む', () => {
    const { lastFrame } = render(
      <Footer currentSlide={0} totalSlides={1} />,
    )

    const frame = lastFrame()
    expect(frame).toContain('Timer:')
    expect(frame).toContain('5:00') // 300秒 = 5分
  })

  it('タイマーが動作中の場合は再生アイコンを表示', () => {
    // このテスト用にモックを更新
    vi.mocked(useTimerModule.useTimer).mockReturnValue({
      ...mockTimer,
      isRunning: true,
      remainingSeconds: 125, // 2:05
    })

    const { lastFrame } = render(
      <Footer currentSlide={0} totalSlides={1} />,
    )

    const frame = lastFrame()
    expect(frame).toContain('▶')
    expect(frame).toContain('2:05')
  })

  it('タイマーが停止中の場合は一時停止アイコンを表示', () => {
    // このテスト用にモックを更新
    vi.mocked(useTimerModule.useTimer).mockReturnValue({
      ...mockTimer,
      isRunning: false,
      remainingSeconds: 60, // 1:00
    })

    const { lastFrame } = render(
      <Footer currentSlide={0} totalSlides={1} />,
    )

    const frame = lastFrame()
    expect(frame).toContain('⏸')
    expect(frame).toContain('1:00')
  })

  it('タイマーが0秒の場合の表示', () => {
    // このテスト用にモックを更新
    vi.mocked(useTimerModule.useTimer).mockReturnValue({
      ...mockTimer,
      remainingSeconds: 0,
      isRunning: false,
    })

    const { lastFrame } = render(
      <Footer currentSlide={0} totalSlides={1} />,
    )

    expect(lastFrame()).toContain('0:00')
  })

  it('全ての要素が正しくレイアウトされている', () => {
    const { lastFrame } = render(
      <Footer currentSlide={1} totalSlides={3} />,
    )

    const frame = lastFrame()
    // 上部の罫線
    expect(frame).toMatch(/─/)
    // プログレスバー、タイマー、ナビゲーション情報が含まれる
    expect(frame).toContain('█')
    expect(frame).toContain('Timer:')
    expect(frame).toContain('Slide 2 / 3')
  })

  it('要素が正しい順序で表示される', () => {
    const { lastFrame } = render(
      <Footer currentSlide={1} totalSlides={3} />,
    )

    const frame = lastFrame()
    if (!frame) throw new Error('Frame is undefined')
    const lines = frame.split('\n')

    // プログレスバーが最初に表示される
    const progressBarIndex = lines.findIndex((line) => line.includes('█'))
    // スライド番号が次に表示される
    const slideNumberIndex = lines.findIndex((line) => line.includes('Slide'))
    // タイマーが最後に表示される
    const timerIndex = lines.findIndex((line) => line.includes('Timer:'))

    expect(progressBarIndex).toBeGreaterThan(-1)
    expect(slideNumberIndex).toBeGreaterThan(-1)
    expect(timerIndex).toBeGreaterThan(-1)
    expect(progressBarIndex).toBeLessThan(slideNumberIndex)
    expect(slideNumberIndex).toBeLessThan(timerIndex)
  })
})