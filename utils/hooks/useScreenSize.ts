import { useEffect, useState } from "react";

function useScreenSize(maxWidth = 768): {
    size: { width: number; height: number };
    isMobile: boolean;
} {
    const [isMobile, setIsMobile] = useState(false);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const handleResize = (window: Window) => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
        setIsMobile(window.innerWidth <= maxWidth);
    };

    useEffect(() => {
        handleResize(window);

        window.addEventListener("resize", () => handleResize(window));

        return () => {
            window.removeEventListener("resize", () => handleResize(window));
        };
    }, [maxWidth]);

    return { size: { width, height }, isMobile };
}

export default useScreenSize;
