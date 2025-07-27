import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import React, { useEffect, useRef, useState } from 'react';
// タイマー表示を独立したコンポーネントで管理
// 点滅アニメーションを最適化
export const OptimizedTimerDisplay = React.memo(({ remainingSeconds, isRunning }) => {
    const [isFlashing, setIsFlashing] = useState(false);
    const flashIntervalRef = useRef(null);
    useEffect(() => {
        if (remainingSeconds === 0) {
            flashIntervalRef.current = setInterval(() => {
                setIsFlashing((prev) => !prev);
            }, 500);
        }
        else {
            if (flashIntervalRef.current) {
                clearInterval(flashIntervalRef.current);
                flashIntervalRef.current = null;
            }
            setIsFlashing(false);
        }
        return () => {
            if (flashIntervalRef.current) {
                clearInterval(flashIntervalRef.current);
            }
        };
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
}, 
// メモ化の比較関数を追加
(prevProps, nextProps) => {
    // 秒数が同じで、動作状態も同じなら再レンダリングしない
    return (prevProps.remainingSeconds === nextProps.remainingSeconds &&
        prevProps.isRunning === nextProps.isRunning);
});
