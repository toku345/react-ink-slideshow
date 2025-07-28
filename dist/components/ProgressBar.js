import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import React from 'react';
export const ProgressBar = React.memo(({ currentSlide, totalSlides }) => {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    const filledBlocks = Math.ceil(progress / 5);
    const emptyBlocks = Math.floor((100 - progress) / 5);
    return (_jsx(Box, { children: _jsxs(Text, { children: [_jsx(Text, { color: "cyan", children: '█'.repeat(filledBlocks) }), '━'.repeat(emptyBlocks)] }) }));
});
