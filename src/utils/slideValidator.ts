import type { ContentSlideData, SlideData, TitleSlideData } from '../types/slide.js'

export function isTitleSlide(slide: unknown): slide is TitleSlideData {
  if (typeof slide !== 'object' || slide === null) {
    return false
  }

  const obj = slide as Record<string, unknown>
  
  return (
    obj.type === 'title' &&
    typeof obj.title === 'string' &&
    (obj.subtitle === undefined || typeof obj.subtitle === 'string') &&
    (obj.author === undefined || typeof obj.author === 'string')
  )
}

export function isContentSlide(slide: unknown): slide is ContentSlideData {
  if (typeof slide !== 'object' || slide === null) {
    return false
  }

  const obj = slide as Record<string, unknown>
  
  return (
    (obj.type === undefined || obj.type === 'content') &&
    (obj.title === undefined || typeof obj.title === 'string') &&
    typeof obj.content === 'string'
  )
}

export function validateSlideData(data: unknown): SlideData[] {
  if (!Array.isArray(data)) {
    throw new Error('Slides data must be an array')
  }

  if (data.length === 0) {
    throw new Error('Slides data must contain at least one slide')
  }

  const validatedSlides: SlideData[] = []
  const errors: string[] = []

  data.forEach((slide, index) => {
    if (typeof slide !== 'object' || slide === null) {
      errors.push(`Slide ${index + 1}: Invalid slide format - must be an object`)
      return
    }

    const slideObj = slide as Record<string, unknown>

    if (slideObj.type === 'title') {
      if (!isTitleSlide(slide)) {
        const missingFields: string[] = []
        if (typeof slideObj.title !== 'string') {
          missingFields.push('title (string)')
        }
        if (slideObj.subtitle !== undefined && typeof slideObj.subtitle !== 'string') {
          missingFields.push('subtitle must be a string')
        }
        if (slideObj.author !== undefined && typeof slideObj.author !== 'string') {
          missingFields.push('author must be a string')
        }
        
        errors.push(
          `Slide ${index + 1} (title slide): Invalid or missing fields - ${missingFields.join(', ')}`
        )
      } else {
        validatedSlides.push(slide)
      }
    } else if (slideObj.type === undefined || slideObj.type === 'content') {
      if (!isContentSlide(slide)) {
        const missingFields: string[] = []
        if (typeof slideObj.content !== 'string') {
          missingFields.push('content (string)')
        }
        if (slideObj.title !== undefined && typeof slideObj.title !== 'string') {
          missingFields.push('title must be a string')
        }
        
        errors.push(
          `Slide ${index + 1} (content slide): Invalid or missing fields - ${missingFields.join(', ')}`
        )
      } else {
        validatedSlides.push(slide)
      }
    } else {
      errors.push(
        `Slide ${index + 1}: Unknown slide type '${slideObj.type}'. Valid types are 'title' or 'content'`
      )
    }
  })

  if (errors.length > 0) {
    throw new Error(`Validation errors:\n${errors.join('\n')}`)
  }

  return validatedSlides
}