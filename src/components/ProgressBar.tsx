import { Box, Text } from 'ink'
import React from 'react'

interface ProgressBarProps {
  currentSlide: number
  totalSlides: number
}

export const ProgressBar: React.FC<ProgressBarProps> = React.memo(
  ({ currentSlide, totalSlides }) => {
    const progress = ((currentSlide + 1) / totalSlides) * 100
    const filledBlocks = Math.ceil(progress / 5)
    const emptyBlocks = Math.floor((100 - progress) / 5)

    return (
      <Box>
        <Text>
          <Text color="cyan">{'█'.repeat(filledBlocks)}</Text>
          {'━'.repeat(emptyBlocks)}
        </Text>
      </Box>
    )
  },
)
