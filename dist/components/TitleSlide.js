import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import React from 'react';
export const TitleSlide = React.memo(({ title, subtitle, author }) => {
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", children: [_jsx(Gradient, { name: "rainbow", children: _jsx(BigText, { text: title }) }), subtitle && (_jsx(Box, { marginTop: 2, children: _jsx(Text, { bold: true, color: "cyan", children: subtitle }) })), author && (_jsx(Box, { marginTop: 3, children: _jsxs(Text, { color: "yellow", children: ["\u767A\u8868\u8005: ", author] }) }))] }));
});
