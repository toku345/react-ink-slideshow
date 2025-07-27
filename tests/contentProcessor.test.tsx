import { render } from 'ink-testing-library'
import { describe, expect, it, vi } from 'vitest'
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

  it('未閉じのコードブロックもコードブロックとして処理する', () => {
    const content = '```javascript\nconst x = 1;\nconsole.log(x);'
    const { lastFrame } = render(processContent(content))
    const output = lastFrame()
    // 未閉じのコードブロックもシンタックスハイライトされる
    expect(output).toContain('const')
    expect(output).toContain('x')
    expect(output).toContain('1')
    expect(output).toContain('console')
    expect(output).toContain('log')
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

  it('連続する複数のコードブロックを処理できる', () => {
    const content = '```js\nconst a = 1;\n```\n```python\nprint("hello")\n```'
    const { lastFrame } = render(processContent(content))
    const output = lastFrame()
    // 両方のコードブロックが処理される
    expect(output).toContain('const')
    expect(output).toContain('a')
    expect(output).toContain('print')
    expect(output).toContain('hello')
  })

  it('コードブロック内の特殊文字を正しく処理する', () => {
    const content = '```js\nconst str = "Hello\\nWorld";\nconst regex = /\\d+/g;\n```'
    const { lastFrame } = render(processContent(content))
    const output = lastFrame()
    expect(output).toContain('const')
    expect(output).toContain('str')
    expect(output).toContain('Hello')
    expect(output).toContain('World')
    expect(output).toContain('regex')
  })

  it('コードブロック内にバッククォートを含む場合', () => {
    const content = '```js\nconst template = `Hello ${name}`;\n```'
    const { lastFrame } = render(processContent(content))
    const output = lastFrame()
    expect(output).toContain('const')
    expect(output).toContain('template')
    expect(output).toContain('Hello')
    expect(output).toContain('name')
  })

  describe('テキストフォーマット', () => {
    it('**テキスト**をボールドで表示する', () => {
      const content = 'これは**重要な**テキストです'
      const { lastFrame } = render(processContent(content))
      const output = lastFrame()
      expect(output).toContain('これは')
      expect(output).toContain('重要な')
      expect(output).toContain('テキストです')
    })

    it('複数のボールドテキストを処理できる', () => {
      const content = '**最初**の部分と**二番目**の部分'
      const { lastFrame } = render(processContent(content))
      const output = lastFrame()
      expect(output).toContain('最初')
      expect(output).toContain('の部分と')
      expect(output).toContain('二番目')
      expect(output).toContain('の部分')
    })

    it('ボールドテキストが行頭にある場合', () => {
      const content = '**重要**：この内容に注意'
      const { lastFrame } = render(processContent(content))
      const output = lastFrame()
      expect(output).toContain('重要')
      expect(output).toContain('：この内容に注意')
    })

    it('ボールドテキストが行末にある場合', () => {
      const content = 'この内容は**重要**'
      const { lastFrame } = render(processContent(content))
      const output = lastFrame()
      expect(output).toContain('この内容は')
      expect(output).toContain('重要')
    })

    it('ボールドマークが不完全な場合は通常のテキストとして扱う', () => {
      const content = 'これは**不完全なテキスト'
      const { lastFrame } = render(processContent(content))
      const output = lastFrame()
      expect(output).toContain('これは**不完全なテキスト')
    })
  })
})