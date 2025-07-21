#!/usr/bin/env node
import { jsx as _jsx } from "react/jsx-runtime";
import { Box, render } from 'ink';
import { SlideShow, sampleSlides } from './index.js';
// Raw modeがサポートされているかチェック
if (process.stdin.isTTY) {
    // アプリケーションのレンダリング（全画面対応）
    render(_jsx(Box, { flexGrow: 1, children: _jsx(SlideShow, { slides: sampleSlides }) }));
}
else {
    console.error('This app must be run in an interactive terminal (TTY)');
    process.exit(1);
}
