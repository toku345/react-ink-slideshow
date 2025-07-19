# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このツールは、開発者向けのLTで発表するためのスライドをターミナル上で表示するものです。

1度の発表向けなので、以下の点は考慮が不要です：

- スライドを差し替えられるようにする、などの拡張性
- 将来を見越したアーキテクチャ

## 開発コマンド

```bash
# 開発モードで実行
npm run dev

# テスト実行
npm test              # 一度だけ実行
npm run test:watch    # ウォッチモード

# 品質チェック
npm run check         # 全チェック（型、テスト、フォーマット、リント）
npm run typecheck     # TypeScript型チェック
npm run lint          # Biomeでリント（import順序チェックも含む）
npm run format        # コード自動整形

# ビルド
npm run build         # TypeScriptをJavaScriptにコンパイル
```

## アーキテクチャ

### コンポーネント構成

- `SlideShow`: メインコンテナ。スライドナビゲーションとプログレスバーを管理
- `Slide`: 通常のコンテンツスライド表示
- `TitleSlide`: タイトルスライド表示（グラデーション付き大文字）
- `useKeyboardNavigation`: キーボード操作を管理するカスタムフック

### スライドデータ構造

```typescript
// タイトルスライド
{
  type: 'title',
  title: string,
  subtitle?: string,
  author?: string
}

// コンテンツスライド
{
  type?: 'content',  // 省略可能（デフォルト）
  title?: string,
  content: string
}
```

### 使用技術

- **TypeScript**: 型安全な開発
- **React Ink**: ターミナルUI構築
- **ink-big-text**: タイトルスライドの大文字表示
- **ink-gradient**: グラデーション効果
- **Vitest**: テストフレームワーク
- **Biome**: フォーマッター＆リンター（--enforce-assistでimport順序もチェック）
