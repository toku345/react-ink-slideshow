# React Ink Slideshow

ターミナルで動作するスライドショープレゼンテーションツール。React Inkを使用して構築されています。

## 特徴

- 🖥️ ターミナルベースのUI
- ⌨️ キーボードナビゲーション
- 📝 Markdownライクな構文サポート
- 🎨 コードブロックのシンタックスハイライト
- 📊 プログレスバー表示

## クイックスタート

```bash
npx github:toku345/react-ink-slideshow
```

## 開発

### 開発環境での実行

```bash
npm install
npm run dev
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
npm run check      # TypeScript、テスト、フォーマット、リントを実行
npm run check:dist # distフォルダが最新かチェック
```

### 開発者向け注意事項

このプロジェクトでは、distフォルダをGitにコミットしています。
TypeScriptファイルを変更した場合は、必ず以下を実行してください：

```bash
npm run build     # ビルド実行
git add dist/     # distフォルダをステージング
```

pre-commitフックが設定されているため、TypeScriptファイルを変更した際に
distフォルダが更新されていない場合は、コミットが拒否されます。

## 技術スタック

- **TypeScript**: 型安全な開発
- **React Ink**: ターミナルUI構築
- **Vitest**: テストフレームワーク
- **Biome**: フォーマッター＆リンター

## ライセンス

MIT
