import type { ContentSlideData, SlideData, TitleSlideData } from '../types/slide.js'

/**
 * タイトルスライドかどうかを判定する型ガード関数
 */
export function isTitleSlide(slide: unknown): slide is TitleSlideData {
  if (typeof slide !== 'object' || slide === null) {
    return false
  }

  return (
    'type' in slide &&
    slide.type === 'title' &&
    'title' in slide &&
    typeof slide.title === 'string'
  )
}

/**
 * コンテンツスライドかどうかを判定する型ガード関数
 */
export function isContentSlide(slide: unknown): slide is ContentSlideData {
  if (typeof slide !== 'object' || slide === null) {
    return false
  }

  // typeが未定義またはcontentの場合はコンテンツスライド
  return (
    'content' in slide &&
    typeof slide.content === 'string' &&
    (!('type' in slide) || slide.type === undefined || slide.type === 'content')
  )
}

/**
 * スライドデータのバリデーションを実行
 * @param data バリデーション対象のデータ
 * @returns バリデーション済みのスライドデータ
 * @throws バリデーションエラーの場合はエラーをスロー
 */
export function validateSlideData(data: unknown): SlideData[] {
  // 配列チェック
  if (!Array.isArray(data)) {
    throw new Error('Slide data must be an array')
  }

  // 空配列チェック
  if (data.length === 0) {
    throw new Error('Slide data must contain at least one slide')
  }

  // 各スライドのバリデーション
  const validatedSlides: SlideData[] = []

  for (let i = 0; i < data.length; i++) {
    const slide = data[i]

    if (isTitleSlide(slide)) {
      // タイトルスライドの追加バリデーション
      if (!slide.title.trim()) {
        throw new Error(`Slide ${i + 1}: Title slide must have a non-empty title`)
      }
      validatedSlides.push(slide)
    } else if (isContentSlide(slide)) {
      // コンテンツスライドの追加バリデーション
      if (!slide.content.trim()) {
        throw new Error(`Slide ${i + 1}: Content slide must have non-empty content`)
      }
      validatedSlides.push(slide)
    } else {
      // 不正なスライドタイプ
      const slideType =
        typeof slide === 'object' && slide !== null && 'type' in slide ? slide.type : 'unknown'
      throw new Error(
        `Slide ${i + 1}: Invalid slide structure. Got type: ${slideType}. Expected 'title' or 'content' (or undefined for content)`,
      )
    }
  }

  return validatedSlides
}
