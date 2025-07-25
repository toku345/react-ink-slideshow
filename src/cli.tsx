#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Box, render } from 'ink'
import yaml from 'js-yaml'
import { SlideShow } from './index.js'
import type { SlideData } from './types/slide.js'

// YAMLファイル読み込み
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const slidesData = yaml.load(readFileSync(join(__dirname, 'slides.yaml'), 'utf-8')) as SlideData[]

// Raw modeがサポートされているかチェック
if (process.stdin.isTTY) {
  // アプリケーションのレンダリング（全画面対応）
  render(
    <Box flexGrow={1}>
      <SlideShow slides={slidesData} />
    </Box>,
  )
} else {
  console.error('This app must be run in an interactive terminal (TTY)')
  process.exit(1)
}
