export interface UseTimerReturn {
    remainingSeconds: number;
    isRunning: boolean;
    start: () => void;
    stop: () => void;
    toggle: () => void;
    reset: () => void;
}
export declare const useTimer: (durationSeconds?: number) => UseTimerReturn;
//# sourceMappingURL=useTimer.d.ts.map