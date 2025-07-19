# React Ink Slideshow

ターミナルで動作するスライドショープレゼンテーションツール。React Inkを使用して構築されています。

## 特徴

- 🖥️ ターミナルベースのUI
- ⌨️ キーボードナビゲーション
- 📝 Markdownライクな構文サポート
- 🎨 コードブロックのシンタックスハイライト
- 📊 プログレスバー表示

## インストール

```bash
npm install react-ink-slideshow
```

## 使い方

### CLIとして実行

```bash
npm run dev
```

### プログラムから使用

```typescript
import { render } from 'ink'
import { SlideShow } from 'react-ink-slideshow'

const slides = [
  {
    title: 'スライド1',
    content: 'コンテンツ'
  },
  {
    title: 'スライド2',
    content: `複数行の
コンテンツも
サポート`
  }
]

render(<SlideShow slides={slides} />)
```

## キーボード操作

- `←` / `→`: 前/次のスライドへ移動
- `0`: 最初のスライドへジャンプ
- `9`: 最後のスライドへジャンプ
- `q`: 終了

## 開発

### セットアップ

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

### テスト実行

```bash
npm test
```

### ビルド

```bash
npm run build
```

### 品質チェック

```bash
npm run check  # TypeScript、テスト、フォーマット、リントを実行
```

## 技術スタック

- **TypeScript**: 型安全な開発
- **React Ink**: ターミナルUI構築
- **Vitest**: テストフレームワーク
- **Biome**: フォーマッター＆リンター

## ライセンス

MIT