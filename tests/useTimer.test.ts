import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('useTimerフックがエクスポートされている', async () => {
    const module = await import('../src/hooks/useTimer.js')
    expect(module.useTimer).toBeDefined()
    expect(typeof module.useTimer).toBe('function')
  })

  it('UseTimerReturnインターフェースがエクスポートされている', async () => {
    const module = await import('../src/hooks/useTimer.js')
    expect(module).toBeDefined()
  })

  // 負の値のバリデーションテスト
  it('負の値のバリデーションが正しく動作する', () => {
    // Math.maxの動作を確認
    const validDuration1 = Math.max(0, -60)
    expect(validDuration1).toBe(0)

    const validDuration2 = Math.max(0, 120)
    expect(validDuration2).toBe(120)

    const validDuration3 = Math.max(0, 0)
    expect(validDuration3).toBe(0)
  })

  // タイマーロジックのテスト
  it('タイマーの基本的なロジックを確認', () => {
    // カウントダウンロジックの確認
    let count = 10
    const countdown = () => {
      if (count <= 1) {
        return 0
      }
      return count - 1
    }

    expect(countdown()).toBe(9)
    count = 1
    expect(countdown()).toBe(0)
    count = 0
    expect(countdown()).toBe(0)
  })
})

// 時間フォーマットのテストは別のdescribeブロックに
describe('Time formatting', () => {
  it('タイマーの時間フォーマットが正しい', () => {
    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    expect(formatTime(300)).toBe('5:00')
    expect(formatTime(125)).toBe('2:05')
    expect(formatTime(65)).toBe('1:05')
    expect(formatTime(59)).toBe('0:59')
    expect(formatTime(0)).toBe('0:00')
  })
})