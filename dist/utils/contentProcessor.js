import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Newline, Text } from 'ink';
import SyntaxHighlight from 'ink-syntax-highlight';
import React from 'react';
function parseContent(content) {
    const lines = content.split('\n');
    const elements = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith('```')) {
            const codeBlock = parseCodeBlock(lines, i);
            if (codeBlock) {
                elements.push(codeBlock.element);
                i = codeBlock.endIndex + 1;
                continue;
            }
        }
        if (line.startsWith('#')) {
            elements.push({ type: 'heading', content: line });
        }
        else {
            elements.push({ type: 'text', content: line });
        }
        i++;
    }
    return elements;
}
function parseCodeBlock(lines, startIndex) {
    const startLine = lines[startIndex];
    if (!startLine.startsWith('```'))
        return null;
    const language = startLine.slice(3).trim();
    const codeLines = [];
    let endIndex = startIndex;
    for (let i = startIndex + 1; i < lines.length; i++) {
        if (lines[i] === '```') {
            endIndex = i;
            return {
                element: {
                    type: 'codeBlock',
                    language: language || undefined,
                    lines: codeLines,
                },
                endIndex,
            };
        }
        codeLines.push(lines[i]);
    }
    // 未閉じのコードブロックの警告
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`Warning: Unclosed code block starting at line ${startIndex + 1}`);
    }
    // 未閉じのコードブロックもコードブロックとして扱う（より寛容な処理）
    return {
        element: {
            type: 'codeBlock',
            language: language || undefined,
            lines: codeLines,
        },
        endIndex: lines.length - 1,
    };
}
function renderElements(elements) {
    return elements.reduce((acc, element, index) => {
        const rendered = renderElement(element, index);
        // nullの場合は何も追加しない
        if (rendered === null) {
            return acc;
        }
        // 最初の要素以外は改行を追加
        if (index > 0) {
            // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
            acc.push(_jsx(Newline, {}, `newline-${index}`));
        }
        acc.push(rendered);
        return acc;
    }, []);
}
function renderElement(element, index) {
    switch (element.type) {
        case 'heading':
            return (_jsx(Text, { bold: true, color: "cyan", children: element.content }, `heading-${index}`));
        case 'text':
            return _jsx(Text, { children: renderTextWithFormatting(element.content) }, `text-${index}`);
        case 'codeBlock':
            if (element.lines.length === 0) {
                return null;
            }
            if (element.language) {
                return (_jsx(SyntaxHighlight, { code: element.lines.join('\n'), language: element.language }, `codeblock-${index}`));
            }
            else {
                return element.lines.map((line, lineIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
                _jsxs(React.Fragment, { children: [lineIndex > 0 && _jsx(Newline, {}), _jsxs(Text, { color: "green", children: ['  ', line] })] }, `code-${index}-${lineIndex}`)));
            }
    }
}
function renderTextWithFormatting(text) {
    const parts = [];
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;
    match = boldRegex.exec(text);
    while (match !== null) {
        // 通常のテキスト部分
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        // ボールドテキスト部分
        parts.push(_jsx(Text, { bold: true, children: match[1] }, `bold-${match.index}`));
        lastIndex = match.index + match[0].length;
        match = boldRegex.exec(text);
    }
    // 最後の通常テキスト部分
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }
    return parts.length === 0 ? text : parts;
}
export function processContent(content) {
    const elements = parseContent(content);
    const rendered = renderElements(elements);
    return _jsx(Text, { children: rendered });
}
