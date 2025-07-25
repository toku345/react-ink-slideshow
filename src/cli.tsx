#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Box, render } from 'ink'
import { SlideShow } from './index.js'
import type { SlideData } from './types/slide.js'
import { validateSlideData } from './utils/slideValidator.js'
import { parseYaml } from './utils/yamlParser.js'

// YAMLファイル読み込み
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let slidesData: SlideData[]
try {
  const yamlPath = join(__dirname, 'slides.yaml')

  // ファイル存在チェック
  if (!existsSync(yamlPath)) {
    console.error(`Error: slides.yaml not found at ${yamlPath}`)
    process.exit(1)
  }

  const yamlContent = readFileSync(yamlPath, 'utf-8')
  
  // カスタムYAMLパーサーでパース
  const parsedData = parseYaml(yamlContent)
  
  // 型ガードと詳細なバリデーション
  slidesData = validateSlideData(parsedData)
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to load slides.yaml:', error.message)
  } else {
    console.error('Failed to load slides.yaml:', error)
  }
  process.exit(1)
}

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
