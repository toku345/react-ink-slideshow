export function parseYaml(content: string): unknown[] {
  const lines = content.split('\n')
  const slides: unknown[] = []
  let currentSlide: Record<string, unknown> = {}
  let inMultilineContent = false
  let multilineKey = ''
  let multilineContent: string[] = []
  let indentLevel = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    if (trimmedLine === '' && !inMultilineContent) {
      continue
    }

    if (line.startsWith('- ') && !inMultilineContent) {
      if (Object.keys(currentSlide).length > 0) {
        slides.push(currentSlide)
      }
      currentSlide = {}
      const rest = line.substring(2).trim()
      
      if (rest) {
        const colonIndex = rest.indexOf(':')
        if (colonIndex !== -1) {
          const key = rest.substring(0, colonIndex).trim()
          const value = rest.substring(colonIndex + 1).trim()
          
          if (value === '|') {
            inMultilineContent = true
            multilineKey = key
            multilineContent = []
            indentLevel = 0
          } else {
            currentSlide[key] = parseValue(value)
          }
        }
      }
    } else if (inMultilineContent) {
      if (indentLevel === 0 && line.length > 0 && line[0] === ' ') {
        let spaces = 0
        for (const char of line) {
          if (char === ' ') spaces++
          else break
        }
        indentLevel = spaces
      }

      if (line.length > 0 && !line.startsWith(' '.repeat(indentLevel)) && !trimmedLine.startsWith('-')) {
        currentSlide[multilineKey] = multilineContent.join('\n').trim()
        inMultilineContent = false
        multilineKey = ''
        multilineContent = []
        indentLevel = 0
        i--
      } else {
        if (line.startsWith(' '.repeat(indentLevel))) {
          multilineContent.push(line.substring(indentLevel))
        } else if (trimmedLine === '') {
          multilineContent.push('')
        }
      }
    } else if (trimmedLine.includes(':') && !inMultilineContent) {
      const colonIndex = trimmedLine.indexOf(':')
      const key = trimmedLine.substring(0, colonIndex).trim()
      const value = trimmedLine.substring(colonIndex + 1).trim()
      
      if (value === '|') {
        inMultilineContent = true
        multilineKey = key
        multilineContent = []
        indentLevel = 0
      } else {
        currentSlide[key] = parseValue(value)
      }
    }
  }

  if (inMultilineContent && multilineKey) {
    currentSlide[multilineKey] = multilineContent.join('\n').trim()
  }

  if (Object.keys(currentSlide).length > 0) {
    slides.push(currentSlide)
  }

  return slides
}

function parseValue(value: string): string | boolean | number {
  const trimmed = value.trim()
  
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1)
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1)
  }
  
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  
  if (/^-?\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10)
  }
  if (/^-?\d+\.\d+$/.test(trimmed)) {
    return parseFloat(trimmed)
  }
  
  return trimmed
}