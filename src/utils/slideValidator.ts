import type { SlideData, TitleSlideData, ContentSlideData } from '../types/slide.js'

export function isTitleSlide(slide: unknown): slide is TitleSlideData {
  if (typeof slide !== 'object' || slide === null) {
    return false
  }
  
  const s = slide as Record<string, unknown>
  return s.type === 'title' && 
         typeof s.title === 'string' &&
         (s.subtitle === undefined || typeof s.subtitle === 'string') &&
         (s.author === undefined || typeof s.author === 'string')
}

export function isContentSlide(slide: unknown): slide is ContentSlideData {
  if (typeof slide !== 'object' || slide === null) {
    return false
  }
  
  const s = slide as Record<string, unknown>
  return (s.type === undefined || s.type === 'content') && 
         typeof s.content === 'string' &&
         (s.title === undefined || typeof s.title === 'string')
}

export function validateSlideData(data: unknown): SlideData[] {
  if (!Array.isArray(data)) {
    throw new Error('Slide data must be an array')
  }

  const validatedSlides: SlideData[] = []
  const errors: string[] = []

  data.forEach((slide, index) => {
    if (isTitleSlide(slide)) {
      validatedSlides.push(slide)
    } else if (isContentSlide(slide)) {
      validatedSlides.push(slide)
    } else {
      const slideInfo = JSON.stringify(slide, null, 2)
      errors.push(`Slide at index ${index} is invalid:\n${slideInfo}`)
      
      // Provide specific error messages
      if (typeof slide !== 'object' || slide === null) {
        errors.push(`  - Slide must be an object`)
      } else {
        const s = slide as Record<string, unknown>
        
        if (s.type === 'title') {
          if (typeof s.title !== 'string') {
            errors.push(`  - Title slide must have a 'title' field of type string`)
          }
        } else if (s.type === undefined || s.type === 'content') {
          if (typeof s.content !== 'string') {
            errors.push(`  - Content slide must have a 'content' field of type string`)
          }
        } else {
          errors.push(`  - Invalid slide type: ${s.type}. Must be 'title', 'content', or undefined`)
        }
      }
    }
  })

  if (errors.length > 0) {
    throw new Error(`Invalid slide data:\n${errors.join('\n')}`)
  }

  if (validatedSlides.length === 0) {
    throw new Error('No valid slides found in the data')
  }

  return validatedSlides
}