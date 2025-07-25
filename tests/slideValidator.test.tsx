import { describe, expect, it } from 'vitest'
import {
  isContentSlide,
  isTitleSlide,
  validateSlideData,
} from '../src/utils/slideValidator.js'
import type { ContentSlideData, SlideData, TitleSlideData } from '../src/types/slide.js'

describe('slideValidator', () => {
  describe('isTitleSlide', () => {
    it('should return true for valid title slide', () => {
      const validTitleSlide: TitleSlideData = {
        type: 'title',
        title: 'Test Title',
      }
      expect(isTitleSlide(validTitleSlide)).toBe(true)
    })

    it('should return true for title slide with optional fields', () => {
      const titleSlideWithOptional: TitleSlideData = {
        type: 'title',
        title: 'Test Title',
        subtitle: 'Test Subtitle',
        author: 'Test Author',
      }
      expect(isTitleSlide(titleSlideWithOptional)).toBe(true)
    })

    it('should return false for content slide', () => {
      const contentSlide: ContentSlideData = {
        content: 'Test content',
      }
      expect(isTitleSlide(contentSlide)).toBe(false)
    })

    it('should return false for invalid structures', () => {
      expect(isTitleSlide(null)).toBe(false)
      expect(isTitleSlide(undefined)).toBe(false)
      expect(isTitleSlide('string')).toBe(false)
      expect(isTitleSlide(123)).toBe(false)
      expect(isTitleSlide([])).toBe(false)
      expect(isTitleSlide({})).toBe(false)
      expect(isTitleSlide({ type: 'title' })).toBe(false) // missing title
      expect(isTitleSlide({ type: 'content', title: 'Test' })).toBe(false)
    })
  })

  describe('isContentSlide', () => {
    it('should return true for valid content slide without type', () => {
      const contentSlide: ContentSlideData = {
        content: 'Test content',
      }
      expect(isContentSlide(contentSlide)).toBe(true)
    })

    it('should return true for valid content slide with type', () => {
      const contentSlideWithType: ContentSlideData = {
        type: 'content',
        content: 'Test content',
      }
      expect(isContentSlide(contentSlideWithType)).toBe(true)
    })

    it('should return true for content slide with optional title', () => {
      const contentSlideWithTitle: ContentSlideData = {
        title: 'Test Title',
        content: 'Test content',
      }
      expect(isContentSlide(contentSlideWithTitle)).toBe(true)
    })

    it('should return false for title slide', () => {
      const titleSlide: TitleSlideData = {
        type: 'title',
        title: 'Test Title',
      }
      expect(isContentSlide(titleSlide)).toBe(false)
    })

    it('should return false for invalid structures', () => {
      expect(isContentSlide(null)).toBe(false)
      expect(isContentSlide(undefined)).toBe(false)
      expect(isContentSlide('string')).toBe(false)
      expect(isContentSlide(123)).toBe(false)
      expect(isContentSlide([])).toBe(false)
      expect(isContentSlide({})).toBe(false)
      expect(isContentSlide({ content: 123 })).toBe(false) // content not string
      expect(isContentSlide({ type: 'content' })).toBe(false) // missing content
    })
  })

  describe('validateSlideData', () => {
    it('should validate array of valid slides', () => {
      const validSlides: SlideData[] = [
        {
          type: 'title',
          title: 'Test Title',
          subtitle: 'Test Subtitle',
        },
        {
          content: 'Test content',
        },
        {
          type: 'content',
          title: 'Content Title',
          content: 'Test content with title',
        },
      ]
      expect(() => validateSlideData(validSlides)).not.toThrow()
      expect(validateSlideData(validSlides)).toEqual(validSlides)
    })

    it('should throw error for non-array input', () => {
      expect(() => validateSlideData(null)).toThrow('Slide data must be an array')
      expect(() => validateSlideData(undefined)).toThrow('Slide data must be an array')
      expect(() => validateSlideData('string')).toThrow('Slide data must be an array')
      expect(() => validateSlideData(123)).toThrow('Slide data must be an array')
      expect(() => validateSlideData({})).toThrow('Slide data must be an array')
    })

    it('should throw error for empty array', () => {
      expect(() => validateSlideData([])).toThrow('Slide data must contain at least one slide')
    })

    it('should throw error for empty title in title slide', () => {
      const invalidTitleSlide = [
        {
          type: 'title',
          title: '',
        },
      ]
      expect(() => validateSlideData(invalidTitleSlide)).toThrow(
        'Slide 1: Title slide must have a non-empty title',
      )
    })

    it('should throw error for whitespace-only title', () => {
      const whitespaceTitle = [
        {
          type: 'title',
          title: '   ',
        },
      ]
      expect(() => validateSlideData(whitespaceTitle)).toThrow(
        'Slide 1: Title slide must have a non-empty title',
      )
    })

    it('should throw error for empty content in content slide', () => {
      const invalidContentSlide = [
        {
          content: '',
        },
      ]
      expect(() => validateSlideData(invalidContentSlide)).toThrow(
        'Slide 1: Content slide must have non-empty content',
      )
    })

    it('should throw error for whitespace-only content', () => {
      const whitespaceContent = [
        {
          content: '\n\t  ',
        },
      ]
      expect(() => validateSlideData(whitespaceContent)).toThrow(
        'Slide 1: Content slide must have non-empty content',
      )
    })

    it('should throw error with correct slide index', () => {
      const slidesWithError = [
        { type: 'title', title: 'Valid Title' },
        { content: 'Valid content' },
        { type: 'title', title: '' }, // Error at slide 3
      ]
      expect(() => validateSlideData(slidesWithError)).toThrow(
        'Slide 3: Title slide must have a non-empty title',
      )
    })

    it('should throw error for invalid slide structure', () => {
      const invalidSlides = [
        { type: 'invalid', title: 'Test' },
      ]
      expect(() => validateSlideData(invalidSlides)).toThrow(
        'Slide 1: Invalid slide structure. Got type: invalid. Expected \'title\' or \'content\' (or undefined for content)',
      )
    })

    it('should throw error for slide without required fields', () => {
      const slideWithoutRequiredFields = [
        { randomField: 'value' },
      ]
      expect(() => validateSlideData(slideWithoutRequiredFields)).toThrow(
        'Slide 1: Invalid slide structure. Got type: unknown. Expected \'title\' or \'content\' (or undefined for content)',
      )
    })

    it('should handle mixed valid and invalid slides correctly', () => {
      const mixedSlides = [
        { type: 'title', title: 'Valid Title' },
        { invalid: 'structure' }, // This should fail
        { content: 'Valid content' },
      ]
      expect(() => validateSlideData(mixedSlides)).toThrow(
        'Slide 2: Invalid slide structure',
      )
    })
  })
})