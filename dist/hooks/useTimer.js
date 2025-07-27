import { useEffect, useRef, useState } from 'react';
const DEFAULT_DURATION_SECONDS = 300; // 5分
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
        else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
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
