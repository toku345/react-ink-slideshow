import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import React from 'react';
import { ProgressBar } from './ProgressBar.js';
import { TimerDisplay } from './TimerDisplay.js';
// フッターコンポーネントを分離してメモ化
// タイマー更新時にスライド本体が再レンダリングされるのを防ぐ
export const Footer = React.memo(({ currentSlide, totalSlides, timer }) => {
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "single", borderTop: true, paddingTop: 1, paddingBottom: 1, paddingLeft: 2, paddingRight: 2, children: [_jsx(Box, { marginBottom: 1, children: _jsx(ProgressBar, { currentSlide: currentSlide, totalSlides: totalSlides }) }), _jsx(Box, { marginBottom: 1, children: _jsx(TimerDisplay, { remainingSeconds: timer.remainingSeconds, isRunning: timer.isRunning }) }), _jsxs(Box, { justifyContent: "space-between", children: [_jsxs(Text, { children: ["Slide ", currentSlide + 1, " / ", totalSlides] }), _jsx(Text, { dimColor: true, children: "\u2190 \u2192 Navigate | 0/9 First/Last | t Timer | r Reset | q Quit" })] })] }));
});
