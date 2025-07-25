import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { processContent } from '../utils/contentProcessor.js';
export const Slide = ({ title, content }) => {
    const processedLines = processContent(content);
    return (_jsxs(Box, { flexDirection: "column", padding: 2, width: "100%", children: [title && (_jsx(Box, { marginBottom: 1, children: _jsx(Text, { bold: true, color: "yellow", underline: true, children: title }) })), _jsx(Box, { flexDirection: "column", children: processedLines })] }));
};
