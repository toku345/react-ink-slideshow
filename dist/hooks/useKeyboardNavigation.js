import { useInput } from 'ink';
import { useState } from 'react';
export const useKeyboardNavigation = (totalSlides, onExit) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    useInput((input, key) => {
        // 終了
        if (input === 'q' && onExit) {
            onExit();
            return;
        }
        // 右矢印キー: 次のスライド
        if (key.rightArrow) {
            setCurrentSlide((prev) => {
                const next = prev + 1;
                return next < totalSlides ? next : prev;
            });
        }
        // 左矢印キー: 前のスライド
        if (key.leftArrow) {
            setCurrentSlide((prev) => {
                const next = prev - 1;
                return next >= 0 ? next : prev;
            });
        }
        // 0キー: 最初のスライド
        if (input === '0') {
            setCurrentSlide(0);
        }
        // 9キー: 最後のスライド
        if (input === '9') {
            setCurrentSlide(totalSlides - 1);
        }
        // タイマー操作はFooterコンポーネント内で処理される
    });
    return { currentSlide };
};
