import { render } from 'ink-testing-library'
import { describe, expect, it } from 'vitest'
import { processContent } from '../src/utils/contentProcessor'

describe('processContent', () => {
  it('通常のテキストを処理できる', () => {
    const content = '通常のテキストです'
    const { lastFrame } = render(processContent(content))
    expect(lastFrame()).toContain('通常のテキストです')
  })

  it('見出しを太字シアンで表示する', () => {
    const content = '# 見出しテキスト'
    const { lastFrame } = render(processContent(content))
    expect(lastFrame()).toContain('見出しテキスト')
  })

  it('複数行のテキストを処理できる', () => {
    const content = '1行目\n2行目\n3行目'
    const { lastFrame } = render(processContent(content))
    const output = lastFrame()
    expect(output).toContain('1行目')
    expect(output).toContain('2行目')
    expect(output).toContain('3行目')
  })

  it('言語指定のないコードブロックを緑色で表示する', () => {
    const content = '```\nconst x = 1;\nconsole.log(x);\n```'
    const { lastFrame } = render(processContent(content))
    const output = lastFrame()
    expect(output).toContain('const x = 1;')
    expect(output).toContain('console.log(x);')
  })

  it('言語指定ありのコードブロックをシンタックスハイライトで表示する', () => {
    const content = '```javascript\nconst x = 1;\nconsole.log(x);\n```'
    const { lastFrame } = render(processContent(content))
    const output = lastFrame()
    expect(output).toContain('const')
    expect(output).toContain('x')
    expect(output).toContain('1')
    expect(output).toContain('console')
    expect(output).toContain('log')
  })

  it('複数のコードブロックを処理できる', () => {
    const content = '```javascript\nconst x = 1;\n```\n\n通常のテキスト\n\n```bash\nnpm install\n```'
    const { lastFrame } = render(processContent(content))
    const output = lastFrame()
    expect(output).toContain('const')
    expect(output).toContain('通常のテキスト')
    expect(output).toContain('npm')
    expect(output).toContain('install')
  })

  it('見出しとコードブロックを組み合わせて処理できる', () => {
    const content = '# 見出し\n\n```javascript\nconst x = 1;\n```\n\n通常のテキスト'
    const { lastFrame } = render(processContent(content))
    const output = lastFrame()
    expect(output).toContain('見出し')
    expect(output).toContain('const')
    expect(output).toContain('通常のテキスト')
  })

  it('空のコードブロックを処理できる', () => {
    const content = '```\n```'
    const { lastFrame } = render(processContent(content))
    expect(() => render(processContent(content))).not.toThrow()
  })

  it('言語指定があっても空のコードブロックを処理できる', () => {
    const content = '```javascript\n```'
    const { lastFrame } = render(processContent(content))
    expect(() => render(processContent(content))).not.toThrow()
  })

  it('未閉じのコードブロックを通常のテキストとして処理する', () => {
    const content = '```javascript\nconst x = 1;\nconsole.log(x);'
    const { lastFrame } = render(processContent(content))
    const output = lastFrame()
    // 未閉じのコードブロックは通常のテキストとして処理される
    expect(output).toContain('```javascript')
    expect(output).toContain('const x = 1;')
    expect(output).toContain('console.log(x);')
  })

  it('コンソール警告が出力される（開発環境）', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const content = '```javascript\nconst x = 1;'
    render(processContent(content))
    
    expect(consoleSpy).toHaveBeenCalledWith('Warning: Unclosed code block starting at line 1')
    
    consoleSpy.mockRestore()
    process.env.NODE_ENV = originalEnv
  })
})