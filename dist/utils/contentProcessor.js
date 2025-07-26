import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Newline, Text } from 'ink';
export function processContent(content) {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBlockStartIndex = -1;
    const elements = [];
    lines.forEach((line, index) => {
        if (line.startsWith('```')) {
            if (!inCodeBlock) {
                codeBlockStartIndex = index;
            }
            inCodeBlock = !inCodeBlock;
            return;
        }
        // 最初の行以外は改行を追加
        if (elements.length > 0) {
            elements.push(_jsx(Newline, {}, `newline-${index}`));
        }
        if (inCodeBlock) {
            elements.push(_jsxs(Text, { color: "green", children: ['  ', line] }, `line-${index}`));
        }
        else if (line.startsWith('#')) {
            elements.push(_jsx(Text, { bold: true, color: "cyan", children: line }, `line-${index}`));
        }
        else {
            elements.push(_jsx(Text, { children: line }, `line-${index}`));
        }
    });
    // 未閉じのコードブロックがある場合の警告
    if (inCodeBlock && process.env.NODE_ENV !== 'production') {
        console.warn(`Warning: Unclosed code block starting at line ${codeBlockStartIndex + 1}`);
    }
    return _jsx(Text, { children: elements });
}
