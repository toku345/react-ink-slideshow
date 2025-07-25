import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { SlideData } from './types/slide.js'
import { validateSlideData } from './utils/slideValidator.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadSlidesFromYAML(): SlideData[] {
  try {
    // Try to load from the project root first (for development)
    const rootPath = join(__dirname, '..', 'slides.yaml')
    const distPath = join(__dirname, 'slides.yaml')
    
    let yamlContent: string
    try {
      yamlContent = readFileSync(rootPath, 'utf-8')
    } catch {
      // Fallback to dist directory (for production)
      yamlContent = readFileSync(distPath, 'utf-8')
    }
    
    // Simple YAML parser for our specific format
    const slides: unknown[] = []
    const lines = yamlContent.split('\n')
    let currentSlide: Record<string, unknown> | null = null
    let currentField: string | null = null
    let multilineContent: string[] = []
    let inMultiline = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()
      
      // Skip empty lines and document separator
      if (!trimmedLine || trimmedLine === '---') continue
      
      // New slide starts with '-'
      if (line.startsWith('- ')) {
        // Save previous slide if exists
        if (currentSlide) {
          if (inMultiline && currentField) {
            currentSlide[currentField] = multilineContent.join('\n').trim()
          }
          slides.push(currentSlide)
        }
        
        // Start new slide
        currentSlide = {}
        inMultiline = false
        multilineContent = []
        
        // Check if the line has inline field
        const inlineMatch = line.match(/^- (\w+):\s*(.+)$/)
        if (inlineMatch) {
          currentSlide[inlineMatch[1]] = inlineMatch[2]
        }
      } else if (currentSlide) {
        // Field definition
        const fieldMatch = line.match(/^\s*(\w+):\s*(.*)$/)
        if (fieldMatch) {
          const [, fieldName, fieldValue] = fieldMatch
          
          // Save previous multiline content if any
          if (inMultiline && currentField) {
            currentSlide[currentField] = multilineContent.join('\n').trim()
            multilineContent = []
          }
          
          if (fieldValue === '|' || fieldValue === '>') {
            // Start multiline content
            inMultiline = true
            currentField = fieldName
            multilineContent = []
          } else if (fieldValue) {
            // Inline value
            currentSlide[fieldName] = fieldValue
            inMultiline = false
            currentField = null
          } else {
            // Empty value
            currentSlide[fieldName] = ''
            inMultiline = false
            currentField = null
          }
        } else if (inMultiline) {
          // Multiline content
          multilineContent.push(line.substring(4)) // Remove indentation
        }
      }
    }
    
    // Save last slide
    if (currentSlide) {
      if (inMultiline && currentField) {
        currentSlide[currentField] = multilineContent.join('\n').trim()
      }
      slides.push(currentSlide)
    }
    
    // Validate and return
    return validateSlideData(slides)
  } catch (error) {
    if (error instanceof Error && error.message.includes('ENOENT')) {
      throw new Error('slides.yaml file not found. Please ensure slides.yaml exists in the project root or dist directory.')
    }
    throw error
  }
}

export const reactInkSlides: SlideData[] = loadSlidesFromYAML()
