import type { UseTimerReturn } from './useTimer.js';
interface UseKeyboardNavigationReturn {
    currentSlide: number;
}
export declare const useKeyboardNavigation: (totalSlides: number, onExit?: () => void, timer?: UseTimerReturn | undefined) => UseKeyboardNavigationReturn;
export {};
//# sourceMappingURL=useKeyboardNavigation.d.ts.map