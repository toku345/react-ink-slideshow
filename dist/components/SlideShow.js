import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, useApp, useStdout } from 'ink';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation.js';
import { ProgressBar } from './ProgressBar.js';
import { Slide } from './Slide.js';
import { TitleSlide } from './TitleSlide.js';
export const SlideShow = ({ slides }) => {
    const { exit } = useApp();
    const { stdout } = useStdout();
    const { currentSlide } = useKeyboardNavigation(slides.length, exit);
    if (slides.length === 0) {
        return (_jsx(Box, { flexDirection: "column", padding: 1, children: _jsx(Text, { color: "red", children: "No slides available" }) }));
    }
    const currentSlideData = slides[currentSlide];
    const renderSlide = () => {
        if (currentSlideData.type === 'title') {
            return (_jsx(TitleSlide, { title: currentSlideData.title, subtitle: currentSlideData.subtitle, author: currentSlideData.author }));
        }
        return (_jsx(Slide, { title: currentSlideData.title, content: currentSlideData.content, fontSize: currentSlideData.fontSize }));
    };
    const terminalHeight = stdout.rows || 30;
    const terminalWidth = stdout.columns || 80;
    const footerHeight = 6;
    return (_jsxs(Box, { flexDirection: "column", height: terminalHeight, width: terminalWidth, children: [_jsx(Box, { flexGrow: 1, height: terminalHeight - footerHeight, width: terminalWidth, justifyContent: "center", alignItems: "center", children: renderSlide() }), _jsxs(Box, { flexDirection: "column", borderStyle: "single", borderTop: true, paddingTop: 1, paddingBottom: 1, paddingLeft: 2, paddingRight: 2, children: [_jsx(Box, { marginBottom: 1, children: _jsx(ProgressBar, { currentSlide: currentSlide, totalSlides: slides.length }) }), _jsxs(Box, { justifyContent: "space-between", children: [_jsxs(Text, { children: ["Slide ", currentSlide + 1, " / ", slides.length] }), _jsx(Text, { dimColor: true, children: "\u2190 \u2192 Navigate | 0/9 First/Last | q Quit" })] })] })] }));
};
