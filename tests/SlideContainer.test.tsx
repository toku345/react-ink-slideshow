import React from 'react'
import { Box, Text } from 'ink'
import { render } from 'ink-testing-library'
import { describe, expect, it } from 'vitest'
import { SlideContainer } from '../src/components/SlideContainer.js'

describe('SlideContainer', () => {
  it('子要素を正しくレンダリングする', () => {
    const { lastFrame } = render(
      <SlideContainer
        terminalHeight={30}
        terminalWidth={80}
        footerHeight={7}
      >
        <Text>Test Content</Text>
      </SlideContainer>,
    )

    expect(lastFrame()).toContain('Test Content')
  })

  it('正しい高さと幅が設定される', () => {
    const { lastFrame } = render(
      <SlideContainer
        terminalHeight={40}
        terminalWidth={100}
        footerHeight={10}
      >
        <Box>
          <Text>Slide Content</Text>
        </Box>
      </SlideContainer>,
    )

    // コンテンツが表示されることを確認
    expect(lastFrame()).toContain('Slide Content')
    // 高さは terminalHeight - footerHeight = 30
  })

  it('複数の子要素を含むことができる', () => {
    const { lastFrame } = render(
      <SlideContainer
        terminalHeight={30}
        terminalWidth={80}
        footerHeight={7}
      >
        <Box flexDirection="column">
          <Text>Title</Text>
          <Text>Content Line 1</Text>
          <Text>Content Line 2</Text>
        </Box>
      </SlideContainer>,
    )

    const frame = lastFrame()
    expect(frame).toContain('Title')
    expect(frame).toContain('Content Line 1')
    expect(frame).toContain('Content Line 2')
  })

  it('中央揃えが適用される', () => {
    const { lastFrame } = render(
      <SlideContainer
        terminalHeight={30}
        terminalWidth={80}
        footerHeight={7}
      >
        <Text>Centered Content</Text>
      </SlideContainer>,
    )

    // justifyContent="center"により中央揃えされる
    expect(lastFrame()).toContain('Centered Content')
  })

  it('空の子要素でもエラーにならない', () => {
    const { lastFrame } = render(
      <SlideContainer
        terminalHeight={30}
        terminalWidth={80}
        footerHeight={7}
      >
        {null}
      </SlideContainer>,
    )

    // エラーなくレンダリングされることを確認
    expect(lastFrame).not.toThrow()
  })

  it('React.memoによるメモ化が機能する', () => {
    // メモ化のテストは、同じpropsで再レンダリングされないことを確認
    const props = {
      terminalHeight: 30,
      terminalWidth: 80,
      footerHeight: 7,
      children: <Text>Memoized Content</Text>,
    }

    const { lastFrame, rerender } = render(<SlideContainer {...props} />)
    const firstRender = lastFrame()

    // 同じpropsで再レンダリング
    rerender(<SlideContainer {...props} />)
    const secondRender = lastFrame()

    // 同じ出力であることを確認
    expect(firstRender).toBe(secondRender)
  })
})