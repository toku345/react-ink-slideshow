import type { ContentSlideData, SlideData, TitleSlideData } from '../types/slide.js';
/**
 * タイトルスライドかどうかを判定する型ガード関数
 * @param slide チェック対象のスライドデータ
 * @returns タイトルスライドの場合true
 */
export declare function isTitleSlide(slide: unknown): slide is TitleSlideData;
/**
 * コンテンツスライドかどうかを判定する型ガード関数
 * @param slide チェック対象のスライドデータ
 * @returns コンテンツスライドの場合true
 */
export declare function isContentSlide(slide: unknown): slide is ContentSlideData;
/**
 * スライドデータのバリデーションを実行
 * @param data バリデーション対象のデータ
 * @returns バリデーション済みのスライドデータ
 * @throws バリデーションエラーの場合はエラーをスロー
 */
export declare function validateSlideData(data: unknown): SlideData[];
//# sourceMappingURL=slideValidator.d.ts.map