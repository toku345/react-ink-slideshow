#!/usr/bin/env node
import { render } from 'ink'
import { sampleSlides, SlideShow } from './index.js'

// Raw modeがサポートされているかチェック
if (process.stdin.isTTY) {
  // アプリケーションのレンダリング
  render(<SlideShow slides={sampleSlides} />)
} else {
  console.error('This app must be run in an interactive terminal (TTY)')
  process.exit(1)
}