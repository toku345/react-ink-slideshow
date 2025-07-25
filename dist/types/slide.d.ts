export interface BaseSlide {
    type?: 'title' | 'content';
}
export interface TitleSlideData extends BaseSlide {
    type: 'title';
    title: string;
    subtitle?: string;
    author?: string;
}
/**
 * コンテンツスライドのデータ構造
 */
export interface ContentSlideData extends BaseSlide {
    type?: 'content';
    /** スライドのタイトル */
    title?: string;
    /** スライドの本文コンテンツ */
    content: string;
    /**
     * フォントサイズオプション
     * - 'normal': 通常のフォントサイズ（デフォルト）
     * - 'large': ink-big-textを使用した大きなフォントサイズ。LT発表時の視認性向上に最適
     *
     * @example
     * ```typescript
     * const slide: ContentSlideData = {
     *   title: 'Large Font Demo',
     *   content: 'This text will be displayed in large font!',
     *   fontSize: 'large'
     * }
     * ```
     *
     * @remarks
     * - コードブロック内のテキストは通常サイズで表示されます
     * - 空行はBigTextで表示されません
     * - 長いコンテンツではパフォーマンスに影響する可能性があります
     */
    fontSize?: 'normal' | 'large';
}
export type SlideData = TitleSlideData | ContentSlideData;
//# sourceMappingURL=slide.d.ts.map