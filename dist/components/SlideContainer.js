import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from 'ink';
import React from 'react';
// スライドコンテナを分離してメモ化
// スライド切り替え時のみ再レンダリングされるようにする
export const SlideContainer = React.memo(({ children, terminalHeight, terminalWidth, footerHeight }) => {
    return (_jsx(Box, { flexGrow: 1, height: terminalHeight - footerHeight, width: terminalWidth, justifyContent: "center", children: children }));
}, 
// propsの比較関数を追加して、必要な時のみ再レンダリング
(prevProps, nextProps) => {
    return (prevProps.terminalHeight === nextProps.terminalHeight &&
        prevProps.terminalWidth === nextProps.terminalWidth &&
        prevProps.footerHeight === nextProps.footerHeight &&
        prevProps.children === nextProps.children);
});
