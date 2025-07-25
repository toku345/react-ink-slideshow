// サンプルスライドデータのエクスポート
export const sampleSlides = [
    {
        type: 'title',
        title: 'React Ink Slideshow',
        subtitle: 'Terminal-based presentation tool',
        author: 'Your Name',
    },
    {
        title: 'Welcome to React Ink Slideshow! 🎉',
        content: `This is a terminal-based slideshow presentation tool.

Built with:
- React Ink
- TypeScript
- Love ❤️

Press arrow keys to navigate!`,
    },
    {
        title: 'Features',
        content: `✨ Terminal-based UI
📝 Markdown-like syntax support
🎨 Syntax highlighting for code blocks
⌨️  Keyboard navigation
📊 Progress bar`,
    },
    {
        title: 'Large Font Demo',
        content: `# This is BIG!

Perfect for LT presentations!

Easy to read from far away.`,
        fontSize: 'large',
    },
    {
        title: 'Code Example',
        content: `Here's how to create a slide:

\`\`\`typescript
const slide = {
  title: 'My Slide',
  content: 'Slide content here'
}
\`\`\`

Easy, right?`,
    },
    {
        title: 'Navigation',
        content: `← → : Previous/Next slide
0   : Jump to first slide
9   : Jump to last slide
q   : Quit the presentation

Try it out!`,
    },
    {
        title: 'The End',
        content: `Thanks for watching! 👋

Made with React Ink 🌈`,
    },
];
export { Slide } from './components/Slide.js';
// コンポーネントのエクスポート
export { SlideShow } from './components/SlideShow.js';
export { TitleSlide } from './components/TitleSlide.js';
