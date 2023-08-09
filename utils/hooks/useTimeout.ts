import { useEffect, useRef } from "react";

function useTimeout(callback: any, delay: number) {
    const timeoutRef = useRef<number | undefined>(undefined);
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => savedCallback.current();

        if (typeof delay === "number") {
            timeoutRef.current = window.setTimeout(tick, delay);

            return () => window.clearTimeout(timeoutRef.current);
        }
    }, [delay]);

    return timeoutRef;
}

export default useTimeout;
