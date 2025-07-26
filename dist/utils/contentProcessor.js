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
    // 未閉じのコードブロックはエラーとして扱う
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`Warning: Unclosed code block starting at line ${startIndex + 1}`);
    }
    // 未閉じのコードブロックは通常のテキストとして扱う
    return null;
}
function renderElements(elements) {
    return elements.flatMap((element, index) => {
        const rendered = renderElement(element, index);
        if (index > 0) {
            // biome-ignore lint/suspicious/noArrayIndexKey: スライドコンテンツは静的であり、順序が変更されることはないため
            return [_jsx(Newline, {}, `newline-${index}`), rendered];
        }
        return [rendered];
    });
}
function renderElement(element, index) {
    switch (element.type) {
        case 'heading':
            return (_jsx(Text, { bold: true, color: "cyan", children: element.content }, `heading-${index}`));
        case 'text':
            return _jsx(Text, { children: element.content }, `text-${index}`);
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
export function processContent(content) {
    const elements = parseContent(content);
    const rendered = renderElements(elements);
    return _jsx(Text, { children: rendered });
}
