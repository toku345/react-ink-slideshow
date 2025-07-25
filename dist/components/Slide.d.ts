import React from 'react';
/**
 * スライドコンポーネントのプロパティ
 */
interface SlideProps {
    /** スライドのタイトル */
    title?: string;
    /** スライドの本文コンテンツ */
    content: string;
    /** フォントサイズオプション ('normal' | 'large') */
    fontSize?: 'normal' | 'large';
}
export declare const Slide: React.FC<SlideProps>;
export {};
//# sourceMappingURL=Slide.d.ts.map