import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import React from 'react'

interface TitleSlideProps {
  title: string
  subtitle?: string
  author?: string
}

export const TitleSlide: React.FC<TitleSlideProps> = ({ title, subtitle, author }) => {
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" height={20}>
      <Gradient name="rainbow">
        <BigText text={title} />
      </Gradient>
      {subtitle && (
        <Box marginTop={2}>
          <Text bold color="cyan">
            {subtitle}
          </Text>
        </Box>
      )}
      {author && (
        <Box marginTop={3}>
          <Text color="yellow">発表者: {author}</Text>
        </Box>
      )}
    </Box>
  )
}
