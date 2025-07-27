import { useEffect, useRef, useState } from 'react';
const DEFAULT_DURATION_SECONDS = 300; // 5分
export const useTimer = (durationSeconds = DEFAULT_DURATION_SECONDS) => {
    const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
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
        setRemainingSeconds(durationSeconds);
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
