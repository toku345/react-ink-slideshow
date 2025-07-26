import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Newline, Text } from 'ink';
export function processContent(content) {
    const lines = content.split('\n');
    let inCodeBlock = false;
    const elements = [];
    lines.forEach((line, index) => {
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            return;
        }
        // 最初の行以外は改行を追加
        if (elements.length > 0) {
            elements.push(_jsx(Newline, {}, `newline-${index}-${line.slice(0, 10).replace(/\s/g, '_')}`));
        }
        if (inCodeBlock) {
            elements.push(_jsxs(Text, { color: "green", children: ['  ', line] }, `line-${index}-${line.slice(0, 10).replace(/\s/g, '_')}`));
        }
        else if (line.startsWith('#')) {
            elements.push(_jsx(Text, { bold: true, color: "cyan", children: line }, `line-${index}-${line.slice(0, 10).replace(/\s/g, '_')}`));
        }
        else {
            elements.push(_jsx(Text, { children: line }, `line-${index}-${line.slice(0, 10).replace(/\s/g, '_')}`));
        }
    });
    return _jsx(Text, { children: elements });
}
