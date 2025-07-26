/**
 * 基本的なオブジェクトバリデーション
 */
function isValidObject(value) {
    return typeof value === 'object' && value !== null;
}
/**
 * フィールドの型チェック
 */
function hasStringField(obj, field) {
    return field in obj && typeof obj[field] === 'string';
}
/**
 * オプションフィールドのバリデーション
 */
function validateOptionalStringField(obj, field) {
    return !(field in obj) || typeof obj[field] === 'string';
}
/**
 * タイトルスライドかどうかを判定する型ガード関数
 */
export function isTitleSlide(slide) {
    if (!isValidObject(slide)) {
        return false;
    }
    // 必須フィールドのチェック
    if (!('type' in slide) || slide.type !== 'title' || !hasStringField(slide, 'title')) {
        return false;
    }
    // オプションフィールドのチェック
    return (validateOptionalStringField(slide, 'subtitle') && validateOptionalStringField(slide, 'author'));
}
/**
 * コンテンツスライドかどうかを判定する型ガード関数
 */
export function isContentSlide(slide) {
    if (!isValidObject(slide)) {
        return false;
    }
    // 必須フィールドのチェック
    if (!hasStringField(slide, 'content')) {
        return false;
    }
    // typeフィールドのチェック（未定義またはcontentのみ許可）
    if ('type' in slide && slide.type !== undefined && slide.type !== 'content') {
        return false;
    }
    // オプションフィールドのチェック
    return validateOptionalStringField(slide, 'title');
}
/**
 * スライドデータのバリデーションを実行
 * @param data バリデーション対象のデータ
 * @returns バリデーション済みのスライドデータ
 * @throws バリデーションエラーの場合はエラーをスロー
 */
export function validateSlideData(data) {
    // 配列チェック
    if (!Array.isArray(data)) {
        throw new Error('Slide data must be an array');
    }
    // 空配列チェック
    if (data.length === 0) {
        throw new Error('Slide data must contain at least one slide');
    }
    // 各スライドのバリデーション
    const validatedSlides = [];
    for (let i = 0; i < data.length; i++) {
        const slide = data[i];
        if (isTitleSlide(slide)) {
            // タイトルスライドの追加バリデーション
            if (!slide.title.trim()) {
                throw new Error(`Slide ${i + 1}: Title slide must have a non-empty title`);
            }
            validatedSlides.push(slide);
        }
        else if (isContentSlide(slide)) {
            // コンテンツスライドの追加バリデーション
            if (!slide.content.trim()) {
                throw new Error(`Slide ${i + 1}: Content slide must have non-empty content`);
            }
            validatedSlides.push(slide);
        }
        else {
            // より詳細なエラーメッセージを生成
            const errors = [];
            if (typeof slide === 'object' && slide !== null) {
                if ('type' in slide && slide.type === 'title') {
                    if (!('title' in slide)) {
                        errors.push('missing required field "title"');
                    }
                    else if (typeof slide.title !== 'string') {
                        errors.push(`"title" must be string, got ${typeof slide.title}`);
                    }
                    if ('subtitle' in slide && typeof slide.subtitle !== 'string') {
                        errors.push(`"subtitle" must be string, got ${typeof slide.subtitle}`);
                    }
                    if ('author' in slide && typeof slide.author !== 'string') {
                        errors.push(`"author" must be string, got ${typeof slide.author}`);
                    }
                }
                else if (!('type' in slide) || slide.type === undefined || slide.type === 'content') {
                    if (!('content' in slide)) {
                        errors.push('missing required field "content"');
                    }
                    else if (typeof slide.content !== 'string') {
                        errors.push(`"content" must be string, got ${typeof slide.content}`);
                    }
                    if ('title' in slide && typeof slide.title !== 'string') {
                        errors.push(`"title" must be string, got ${typeof slide.title}`);
                    }
                }
            }
            // 不正なスライドタイプ
            const slideType = typeof slide === 'object' && slide !== null && 'type' in slide ? slide.type : 'unknown';
            const errorMessage = errors.length > 0
                ? `Slide ${i + 1}: Invalid slide structure. Got type: ${slideType}. Errors: ${errors.join(', ')}`
                : `Slide ${i + 1}: Invalid slide structure. Got type: ${slideType}. Expected 'title' or 'content' (or undefined for content)`;
            throw new Error(errorMessage);
        }
    }
    return validatedSlides;
}
