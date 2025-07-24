#!/usr/bin/env node
import type { SlideData } from './types/slide.js'
import { sampleSlides } from './index.js'

/**
 * デモモード: TTYサポートがない環境でスライドの内容を静的に出力
 */
function printSlide(slide: SlideData, index: number, total: number): void {
  console.log('\n' + '='.repeat(60))
  console.log(`スライド ${index + 1} / ${total}`)
  console.log('='.repeat(60) + '\n')

  if (slide.type === 'title') {
    // タイトルスライドの出力
    console.log(`【タイトル】 ${slide.title}`)
    if (slide.subtitle) {
      console.log(`【サブタイトル】 ${slide.subtitle}`)
    }
    if (slide.author) {
      console.log(`【発表者】 ${slide.author}`)
    }
  } else {
    // コンテンツスライドの出力
    if (slide.title) {
      console.log(`【${slide.title}】`)
      console.log('-'.repeat(slide.title.length + 2))
    }
    if (slide.content) {
      console.log()
      // コンテンツの処理（コードブロックのインデントを保持）
      const lines = slide.content.split('\n')
      let inCodeBlock = false
      
      lines.forEach((line) => {
        if (line.startsWith('```')) {
          inCodeBlock = !inCodeBlock
          console.log(inCodeBlock ? 'コード:' : '---')
          return
        }
        
        if (inCodeBlock) {
          console.log('  ' + line)
        } else if (line.startsWith('#')) {
          console.log(`● ${line.substring(1).trim()}`)
        } else {
          console.log(line)
        }
      })
    }
  }
}

/**
 * メイン実行関数
 */
function main(): void {
  console.log('React Ink Slideshow - デモモード (非対話型)')
  console.log('このモードはTTYサポートがない環境向けです。')
  console.log(`合計 ${sampleSlides.length} 枚のスライドがあります。`)
  
  // 各スライドを順番に出力
  sampleSlides.forEach((slide, index) => {
    printSlide(slide, index, sampleSlides.length)
  })
  
  console.log('\n' + '='.repeat(60))
  console.log('デモモード終了')
  console.log('インタラクティブなプレゼンテーションには、TTY対応のターミナルで実行してください。')
  console.log('='.repeat(60))
}

// 実行
main()