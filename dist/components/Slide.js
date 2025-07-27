import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import React from 'react';
import { processContent } from '../utils/contentProcessor.js';
export const Slide = React.memo(({ title, content }) => {
    const processedContent = processContent(content);
    return (_jsxs(Box, { flexDirection: "column", padding: 2, width: "100%", children: [_jsx(Box, { marginTop: 2, marginBottom: 1, minHeight: 1, children: title && (_jsx(Text, { bold: true, color: "yellow", underline: true, children: title })) }), _jsx(Box, { children: processedContent })] }));
});
