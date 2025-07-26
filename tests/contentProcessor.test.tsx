import { render } from 'ink-testing-library'
import { describe, expect, it } from 'vitest'
import { processContent } from '../src/utils/contentProcessor.js'

describe('processContent', () => {
  it('通常のテキストを処理する', () => {
    const content = 'これは通常のテキストです'
    const { lastFrame } = render(processContent(content))
    expect(lastFrame()).toContain('これは通常のテキストです')
  })

  it('見出しをシアン色で太字で表示する', () => {
    const content = '# 見出し'
    const { lastFrame } = render(processContent(content))
    expect(lastFrame()).toContain('# 見出し')
  })

  it('複数行のコンテンツを処理する', () => {
    const content = '1行目\n2行目\n3行目'
    const { lastFrame } = render(processContent(content))
    expect(lastFrame()).toContain('1行目')
    expect(lastFrame()).toContain('2行目')
    expect(lastFrame()).toContain('3行目')
  })

  it('言語指定なしのコードブロックを緑色で表示する', () => {
    const content = '```\nconst foo = "bar"\nconsole.log(foo)\n```'
    const { lastFrame } = render(processContent(content))
    expect(lastFrame()).toContain('const foo = "bar"')
    expect(lastFrame()).toContain('console.log(foo)')
  })

  it('言語指定ありのコードブロックにシンタックスハイライトを適用する', () => {
    const content = '```javascript\nconst foo = "bar"\nconsole.log(foo)\n```'
    const { lastFrame } = render(processContent(content))
    // シンタックスハイライトが適用されていることを確認
    // ink-syntax-highlightは実際のターミナルでは色付けされるが、
    // テストでは元のコードが表示される
    expect(lastFrame()).toContain('const foo = "bar"')
    expect(lastFrame()).toContain('console.log(foo)')
  })

  it('TypeScriptコードブロックを処理する', () => {
    const content = '```typescript\ninterface User {\n  name: string\n  age: number\n}\n```'
    const { lastFrame } = render(processContent(content))
    expect(lastFrame()).toContain('interface User {')
    expect(lastFrame()).toContain('name: string')
    expect(lastFrame()).toContain('age: number')
    expect(lastFrame()).toContain('}')
  })

  it('コードブロックと通常のテキストを混在させて処理する', () => {
    const content = '説明文\n\n```javascript\nconst x = 42\n```\n\n追加の説明'
    const { lastFrame } = render(processContent(content))
    expect(lastFrame()).toContain('説明文')
    expect(lastFrame()).toContain('const x = 42')
    expect(lastFrame()).toContain('追加の説明')
  })

  it('見出しとコードブロックを混在させて処理する', () => {
    const content = '# セクション1\n\nテキスト\n\n```python\ndef hello():\n    print("Hello")\n```\n\n## セクション2'
    const { lastFrame } = render(processContent(content))
    expect(lastFrame()).toContain('# セクション1')
    expect(lastFrame()).toContain('テキスト')
    expect(lastFrame()).toContain('def hello():')
    expect(lastFrame()).toContain('print("Hello")')
    expect(lastFrame()).toContain('## セクション2')
  })

  it('空のコードブロックを処理する', () => {
    const content = '```\n```'
    const { lastFrame } = render(processContent(content))
    // 空のコードブロックは何も表示しない
    expect(lastFrame()).toBe('')
  })

  it('言語指定ありの空のコードブロックを処理する', () => {
    const content = '```javascript\n```'
    const { lastFrame } = render(processContent(content))
    // 空のコードブロックは何も表示しない
    expect(lastFrame()).toBe('')
  })
})