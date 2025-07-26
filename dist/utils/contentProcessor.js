import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Newline, Text } from 'ink';
import SyntaxHighlight from 'ink-syntax-highlight';
export function processContent(content) {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBlockStartLine = -1;
    let codeBlockLanguage = '';
    let codeBlockContent = [];
    const elements = [];
    lines.forEach((line, index) => {
        if (line.startsWith('```')) {
            if (!inCodeBlock) {
                // コードブロック開始
                codeBlockStartLine = index;
                codeBlockLanguage = line.slice(3).trim(); // ```の後の言語を取得
                codeBlockContent = [];
            }
            else {
                // コードブロック終了
                if (codeBlockContent.length > 0) {
                    // 最初の行以外は改行を追加
                    if (elements.length > 0) {
                        // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
                        elements.push(_jsx(Newline, {}, `newline-${index}-pre`));
                    }
                    if (codeBlockLanguage) {
                        // 言語が指定されている場合はSyntaxHighlightを使用
                        elements.push(_jsx(SyntaxHighlight, { code: codeBlockContent.join('\n'), language: codeBlockLanguage }, `codeblock-${codeBlockStartLine}`));
                    }
                    else {
                        // 言語が指定されていない場合は従来通り緑色で表示
                        codeBlockContent.forEach((codeLine, codeIndex) => {
                            if (codeIndex > 0) {
                                // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
                                elements.push(_jsx(Newline, {}, `newline-${codeBlockStartLine}-${codeIndex}`));
                            }
                            elements.push(
                            // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
                            _jsxs(Text, { color: "green", children: ['  ', codeLine] }, `line-${codeBlockStartLine}-${codeIndex}`));
                        });
                    }
                }
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
            // コードブロック内のコンテンツを収集
            codeBlockContent.push(line);
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
