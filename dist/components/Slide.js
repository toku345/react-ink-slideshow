import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import { processContent } from '../utils/contentProcessor.js';
export const Slide = ({ title, content, fontSize = 'normal' }) => {
    const processedLines = processContent(content, fontSize);
    return (_jsxs(Box, { flexDirection: "column", padding: 2, alignItems: "center", justifyContent: "center", width: "100%", children: [title && (_jsx(Box, { marginBottom: 1, children: fontSize === 'large' ? (_jsx(BigText, { text: title, font: "chrome" })) : (_jsx(Text, { bold: true, color: "yellow", underline: true, children: title })) })), _jsx(Box, { flexDirection: "column", alignItems: "center", children: processedLines })] }));
};
