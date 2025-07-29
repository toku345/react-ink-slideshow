import { useEffect, useRef, useState } from 'react';
import { DEFAULT_DURATION_SECONDS } from '../constants/timer.js';
export const useTimer = (durationSeconds = DEFAULT_DURATION_SECONDS) => {
    // 負の値が渡された場合は0にする
    const validDuration = Math.max(0, durationSeconds);
    const [remainingSeconds, setRemainingSeconds] = useState(validDuration);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const start = () => {
        if (!isRunning && remainingSeconds > 0) {
            setIsRunning(true);
        }
    };
    const stop = () => {
        setIsRunning(false);
    };
    const toggle = () => {
        if (isRunning) {
            stop();
        }
        else {
            start();
        }
    };
    const reset = () => {
        setIsRunning(false);
        setRemainingSeconds(validDuration);
    };
    useEffect(() => {
        if (isRunning && remainingSeconds > 0) {
            try {
                intervalRef.current = setInterval(() => {
                    setRemainingSeconds((prev) => {
                        if (prev <= 1) {
                            setIsRunning(false);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
            catch (error) {
                // setIntervalが失敗した場合
                console.error('タイマーの開始に失敗しました。ページをリロードしてください:', error);
                setIsRunning(false);
            }
        }
        else {
            if (intervalRef.current) {
                try {
                    clearInterval(intervalRef.current);
                }
                catch (error) {
                    // clearIntervalが失敗しても続行
                    console.error('タイマーの停止処理で問題が発生しましたが、動作に影響はありません:', error);
                }
                finally {
                    intervalRef.current = null;
                }
            }
        }
        return () => {
            if (intervalRef.current) {
                try {
                    clearInterval(intervalRef.current);
                }
                catch (error) {
                    console.error('クリーンアップ時のタイマー停止で問題が発生しました:', error);
                }
            }
        };
    }, [isRunning, remainingSeconds]);
    return {
        remainingSeconds,
        isRunning,
        start,
        stop,
        toggle,
        reset,
    };
};
