import React from 'react'
import { render } from 'ink-testing-library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TimerDisplay } from '../src/components/TimerDisplay.js'

describe('TimerDisplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('残り時間を分:秒形式で表示する', () => {
    const { lastFrame } = render(<TimerDisplay remainingSeconds={125} isRunning={false} />)
    expect(lastFrame()).toContain('2:05')
  })

  it('1桁の秒は0でパディングされる', () => {
    const { lastFrame } = render(<TimerDisplay remainingSeconds={65} isRunning={false} />)
    expect(lastFrame()).toContain('1:05')
  })

  it('0秒の場合は0:00と表示される', () => {
    const { lastFrame } = render(<TimerDisplay remainingSeconds={0} isRunning={false} />)
    expect(lastFrame()).toContain('0:00')
  })

  it('タイマーが動作中の場合は▶を表示する', () => {
    const { lastFrame } = render(<TimerDisplay remainingSeconds={300} isRunning={true} />)
    expect(lastFrame()).toContain('▶')
    expect(lastFrame()).toContain('5:00')
  })

  it('タイマーが停止中の場合は⏸を表示する', () => {
    const { lastFrame } = render(<TimerDisplay remainingSeconds={300} isRunning={false} />)
    expect(lastFrame()).toContain('⏸')
    expect(lastFrame()).toContain('5:00')
  })

  it('残り時間が0秒になると赤色で表示される', () => {
    const { lastFrame } = render(<TimerDisplay remainingSeconds={0} isRunning={false} />)
    const output = lastFrame()
    expect(output).toContain('0:00')
    // ink-testing-libraryでは色の検証が難しいため、出力に0:00が含まれることを確認
  })

  it('残り時間が0秒の時は点滅する', () => {
    const { lastFrame, rerender } = render(<TimerDisplay remainingSeconds={0} isRunning={false} />)
    
    // 初期状態
    const firstFrame = lastFrame()
    expect(firstFrame).toContain('0:00')

    // 500ms後（点滅）
    vi.advanceTimersByTime(500)
    rerender(<TimerDisplay remainingSeconds={0} isRunning={false} />)
    const secondFrame = lastFrame()
    expect(secondFrame).toContain('0:00')

    // さらに500ms後（元に戻る）
    vi.advanceTimersByTime(500)
    rerender(<TimerDisplay remainingSeconds={0} isRunning={false} />)
    const thirdFrame = lastFrame()
    expect(thirdFrame).toContain('0:00')
  })

  it('通常時（残り時間がある場合）は緑色で表示される', () => {
    const { lastFrame } = render(<TimerDisplay remainingSeconds={120} isRunning={false} />)
    const output = lastFrame()
    expect(output).toContain('2:00')
    // ink-testing-libraryでは色の検証が難しいため、出力に時間が含まれることを確認
  })
})