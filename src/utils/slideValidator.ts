import type { ContentSlideData, SlideData, TitleSlideData } from '../types/slide.js'

/**
 * タイトルスライドかどうかを判定する型ガード関数
 */
export function isTitleSlide(slide: unknown): slide is TitleSlideData {
  if (typeof slide !== 'object' || slide === null) {
    return false
  }

  // 必須フィールドのチェック
  if (
    !('type' in slide) ||
    slide.type !== 'title' ||
    !('title' in slide) ||
    typeof slide.title !== 'string'
  ) {
    return false
  }

  // オプションフィールドのチェック
  if ('subtitle' in slide && typeof slide.subtitle !== 'string') {
    return false
  }
  if ('author' in slide && typeof slide.author !== 'string') {
    return false
  }

  return true
}

/**
 * コンテンツスライドかどうかを判定する型ガード関数
 */
export function isContentSlide(slide: unknown): slide is ContentSlideData {
  if (typeof slide !== 'object' || slide === null) {
    return false
  }

  // 必須フィールドのチェック
  if (!('content' in slide) || typeof slide.content !== 'string') {
    return false
  }

  // typeフィールドのチェック（未定義またはcontentのみ許可）
  if ('type' in slide && slide.type !== undefined && slide.type !== 'content') {
    return false
  }

  // オプションフィールドのチェック
  if ('title' in slide && typeof slide.title !== 'string') {
    return false
  }

  return true
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
      // より詳細なエラーメッセージを生成
      const errors: string[] = []

      if (typeof slide === 'object' && slide !== null) {
        if ('type' in slide && slide.type === 'title') {
          if (!('title' in slide)) {
            errors.push('missing required field "title"')
          } else if (typeof slide.title !== 'string') {
            errors.push(`"title" must be string, got ${typeof slide.title}`)
          }
          if ('subtitle' in slide && typeof slide.subtitle !== 'string') {
            errors.push(`"subtitle" must be string, got ${typeof slide.subtitle}`)
          }
          if ('author' in slide && typeof slide.author !== 'string') {
            errors.push(`"author" must be string, got ${typeof slide.author}`)
          }
        } else if (!('type' in slide) || slide.type === undefined || slide.type === 'content') {
          if (!('content' in slide)) {
            errors.push('missing required field "content"')
          } else if (typeof slide.content !== 'string') {
            errors.push(`"content" must be string, got ${typeof slide.content}`)
          }
          if ('title' in slide && typeof slide.title !== 'string') {
            errors.push(`"title" must be string, got ${typeof slide.title}`)
          }
        }
      }
      // 不正なスライドタイプ
      const slideType =
        typeof slide === 'object' && slide !== null && 'type' in slide ? slide.type : 'unknown'

      const errorMessage =
        errors.length > 0
          ? `Slide ${i + 1}: Invalid slide structure. Got type: ${slideType}. Errors: ${errors.join(', ')}`
          : `Slide ${i + 1}: Invalid slide structure. Got type: ${slideType}. Expected 'title' or 'content' (or undefined for content)`

      throw new Error(errorMessage)
    }
  }

  return validatedSlides
}
