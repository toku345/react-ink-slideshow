import React, { useState, useEffect } from 'react'
import { render, Text, Box } from 'ink'

const App = () => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Box>
      <Text>カウンター: {counter}</Text>
    </Box>
  )
}

render(<App />)
