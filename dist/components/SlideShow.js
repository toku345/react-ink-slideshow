import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, useApp, useStdout } from 'ink';
import { useMemo } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation.js';
import { useTimer } from '../hooks/useTimer.js';
import { Footer } from './Footer.js';
import { Slide } from './Slide.js';
import { SlideContainer } from './SlideContainer.js';
import { TitleSlide } from './TitleSlide.js';
export const SlideShow = ({ slides }) => {
    const { exit } = useApp();
    const { stdout } = useStdout();
    const timer = useTimer();
    const { currentSlide } = useKeyboardNavigation(slides.length, exit, timer);
    // スライドコンテンツをメモ化して、タイマー更新時の再レンダリングを防ぐ
    const slideContent = useMemo(() => {
        if (slides.length === 0) {
            return null;
        }
        const currentSlideData = slides[currentSlide];
        if (currentSlideData.type === 'title') {
            return (_jsx(TitleSlide, { title: currentSlideData.title, subtitle: currentSlideData.subtitle, author: currentSlideData.author }));
        }
        return _jsx(Slide, { title: currentSlideData.title, content: currentSlideData.content });
    }, [currentSlide, slides]);
    if (slides.length === 0) {
        return (_jsx(Box, { flexDirection: "column", padding: 1, children: _jsx(Text, { color: "red", children: "No slides available" }) }));
    }
    const terminalHeight = stdout.rows || 30;
    const terminalWidth = stdout.columns || 80;
    const footerHeight = 7;
    return (_jsxs(Box, { flexDirection: "column", height: terminalHeight, width: terminalWidth, children: [_jsx(SlideContainer, { terminalHeight: terminalHeight, terminalWidth: terminalWidth, footerHeight: footerHeight, children: slideContent }), _jsx(Footer, { currentSlide: currentSlide, totalSlides: slides.length, timer: timer })] }));
};
