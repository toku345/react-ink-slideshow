# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このツールは、開発者向けのLTで発表するためのスライドをターミナル上で表示するものです。

1度の発表向けなので、以下の点は考慮が不要です：

- スライドを差し替えられるようにする、などの拡張性
- 将来を見越したアーキテクチャ

## 使用技術

このプロジェクトでは、以下の技術を使用します：

### 言語・ランタイム

- TypeScript
- Node.js
- npm

### UIフレームワーク

- React Ink

### 開発ツール

- テスト: Vitest
- フォーマッター: Biome.js
- リンター: oxlint
- 型チェック: TypeScript
