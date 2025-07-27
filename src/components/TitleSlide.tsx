import { Box, Static, Text } from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import React from 'react'

interface TitleSlideProps {
  title: string
  subtitle?: string
  author?: string
}

export const TitleSlide: React.FC<TitleSlideProps> = React.memo(({ title, subtitle, author }) => {
  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" width="100%">
      <Static items={[{ key: 'title', content: title }]}>
        {(item) => (
          <Gradient name="rainbow">
            <BigText text={item.content} />
          </Gradient>
        )}
      </Static>
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
})
