#!/usr/bin/env node
import { Box, render } from 'ink'
import { SlideShow, sampleSlides } from './index.js'

// Raw modeがサポートされているかチェック
if (process.stdin.isTTY) {
  // アプリケーションのレンダリング（全画面対応）
  render(
    <Box flexGrow={1}>
      <SlideShow slides={sampleSlides} />
    </Box>,
  )
} else {
  console.error('This app must be run in an interactive terminal (TTY)')
  process.exit(1)
}
