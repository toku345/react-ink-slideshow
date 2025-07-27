import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { useEffect, useState } from 'react';
export const TimerDisplay = ({ remainingSeconds, isRunning }) => {
    const [isFlashing, setIsFlashing] = useState(false);
    useEffect(() => {
        if (remainingSeconds === 0) {
            const interval = setInterval(() => {
                setIsFlashing((prev) => !prev);
            }, 500);
            return () => clearInterval(interval);
        }
        setIsFlashing(false);
    }, [remainingSeconds]);
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };
    const timeDisplay = formatTime(remainingSeconds);
    const statusText = isRunning ? '▶' : '⏸';
    const timeColor = remainingSeconds === 0 && isFlashing ? 'black' : remainingSeconds === 0 ? 'red' : 'green';
    return (_jsx(Box, { children: _jsxs(Text, { children: ["Timer: ", statusText, ' ', _jsx(Text, { color: timeColor, bold: true, children: timeDisplay })] }) }));
};
