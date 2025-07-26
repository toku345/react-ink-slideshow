import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Newline, Text } from 'ink';
export function processContent(content) {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBlockStartLine = -1;
    const elements = [];
    lines.forEach((line, index) => {
        if (line.startsWith('```')) {
            if (!inCodeBlock) {
                codeBlockStartLine = index;
            }
            inCodeBlock = !inCodeBlock;
            return;
        }
        // 最初の行以外は改行を追加
        if (elements.length > 0) {
            // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
            elements.push(_jsx(Newline, {}, `newline-${index}`));
        }
        if (inCodeBlock) {
            elements.push(
            // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
            _jsxs(Text, { color: "green", children: ['  ', line] }, `line-${index}`));
        }
        else if (line.startsWith('#')) {
            elements.push(
            // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
            _jsx(Text, { bold: true, color: "cyan", children: line }, `line-${index}`));
        }
        else {
            // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
            elements.push(_jsx(Text, { children: line }, `line-${index}`));
        }
    });
    // 未閉じのコードブロックがある場合の警告
    // codeBlockStartLine !== -1 のチェックは論理的には不要だが、
    // 防御的プログラミングの観点から明示的にチェック
    if (inCodeBlock && process.env.NODE_ENV !== 'production' && codeBlockStartLine !== -1) {
        console.warn(`Warning: Unclosed code block starting at line ${codeBlockStartLine + 1}`);
    }
    return _jsx(Text, { children: elements });
}
