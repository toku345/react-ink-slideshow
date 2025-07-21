import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Text } from 'ink';
import BigText from 'ink-big-text';
export function processContent(content, fontSize = 'normal') {
    const lines = content.split('\n');
    let inCodeBlock = false;
    const processedLines = [];
    let lineNumber = 0;
    lines.forEach((line) => {
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            return;
        }
        // 各行に一意のIDを生成（コンテンツと行番号を組み合わせ）
        const lineKey = `line-${lineNumber}-${line.slice(0, 10).replace(/\s/g, '_')}`;
        lineNumber++;
        if (inCodeBlock) {
            processedLines.push(_jsxs(Text, { color: "green", children: ['  ', line] }, lineKey));
        }
        else if (line.startsWith('#')) {
            if (fontSize === 'large' && line.trim()) {
                processedLines.push(_jsx(BigText, { text: line.replace(/^#+\s*/, ''), font: "simple" }, lineKey));
            }
            else {
                processedLines.push(_jsx(Text, { bold: true, color: "cyan", children: line }, lineKey));
            }
        }
        else {
            if (fontSize === 'large' && line.trim()) {
                processedLines.push(_jsx(BigText, { text: line, font: "simple" }, lineKey));
            }
            else {
                processedLines.push(_jsx(Text, { children: line }, lineKey));
            }
        }
    });
    return processedLines;
}
