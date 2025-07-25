#!/usr/bin/env node
import { jsx as _jsx } from "react/jsx-runtime";
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Box, render } from 'ink';
import yaml from 'js-yaml';
import { SlideShow } from './index.js';
// YAMLファイル読み込み
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const slidesData = yaml.load(readFileSync(join(__dirname, 'slides.yaml'), 'utf-8'));
// Raw modeがサポートされているかチェック
if (process.stdin.isTTY) {
    // アプリケーションのレンダリング（全画面対応）
    render(_jsx(Box, { flexGrow: 1, children: _jsx(SlideShow, { slides: slidesData }) }));
}
else {
    console.error('This app must be run in an interactive terminal (TTY)');
    process.exit(1);
}
