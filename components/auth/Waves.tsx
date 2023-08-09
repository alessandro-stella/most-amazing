import { useEffect, useMemo, useRef, useState } from "react";
import Wave from "react-wavify";
import useScreenSize from "utils/hooks/useScreenSize";

interface WaveProps {
    points: number;
    amplitude: number;
    speed: number;
}

function CustomWave({
    index,
    points,
    height,
    amplitude,
    speed,
    paused,
    isHorizontal,
    waveSize,
}: {
    index: number;
    height: number;
    paused: boolean;
    isHorizontal: boolean;
    waveSize: { horizontal: string; vertical: string };
} & WaveProps) {
    const waveColors = [
        "#2a2b41",
        "#31405b",
        "#345674",
        "#326e8c",
        "#3086a1",
        "#33a0b2",
        "#42b9be",
        "#5cd2c6",
    ];

    return (
        <Wave
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: isHorizontal ? "6rem" : "13vw",
                width: isHorizontal ? waveSize.horizontal : waveSize.vertical,
                ...(isHorizontal
                    ? {}
                    : {
                          transformOrigin: "top left",
                          transform: "rotate(-90deg) translate(-100%)",
                      }),
            }}
            paused={paused}
            fill={waveColors[index]}
            options={{
                height: height / (isHorizontal ? 2 : 1),
                amplitude,
                speed,
                points,
            }}
        />
    );
}

export default function Waves() {
    const generateRandomNumber = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const waveData = useMemo(() => {
        function generateRandomValues(): WaveProps[] {
            const allProps: WaveProps[] = [];
            const checkDuplicates: Set<string> = new Set<string>();

            while (allProps.length < 8) {
                const newProps: WaveProps = {
                    amplitude: generateRandomNumber(10, 30),
                    points: generateRandomNumber(4, 6),
                    speed: generateRandomNumber(18, 22) / 100,
                };

                const newPropsAsString = JSON.stringify(newProps);

                if (!checkDuplicates.has(newPropsAsString)) {
                    checkDuplicates.add(newPropsAsString);
                    allProps.push(newProps);
                }
            }

            return allProps;
        }

        return generateRandomValues().map((e, i) => ({
            height: (i + 2) * 15,
            ...e,
        }));
    }, []);

    const {
        size: { width: screenWidth, height: screenHeight },
        isMobile,
    } = useScreenSize(768);

    const horizontalRef = useRef<HTMLInputElement>(null);
    const verticalRef = useRef<HTMLInputElement>(null);

    const [horizontalWaveSize, setHorizontalWaveSize] = useState(0);
    const [verticalWaveSize, setVerticalWaveSize] = useState(0);

    useEffect(() => {
        if (!horizontalRef.current || !verticalRef.current) return;

        if (horizontalRef.current.offsetWidth !== horizontalWaveSize)
            setHorizontalWaveSize(horizontalRef.current.offsetWidth);

        if (verticalRef.current.offsetHeight !== verticalWaveSize)
            setVerticalWaveSize(verticalRef.current.offsetHeight);
    }, [screenWidth, screenHeight, horizontalWaveSize, verticalWaveSize]);

    return (
        <>
            <div
                ref={verticalRef}
                className="relative hidden h-full w-full md:inline md:w-1/5">
                {waveData.map((e, index) => (
                    <CustomWave
                        key={index}
                        index={index}
                        points={e.points}
                        height={e.height}
                        amplitude={e.amplitude}
                        speed={e.speed}
                        paused={isMobile}
                        isHorizontal={false}
                        waveSize={{
                            horizontal: horizontalWaveSize + "px",
                            vertical: verticalWaveSize + "px",
                        }}
                    />
                ))}
            </div>

            <div ref={horizontalRef} className="relative h-24 w-full md:hidden">
                {waveData.map((e, index) => (
                    <CustomWave
                        key={index}
                        index={index}
                        points={e.points}
                        height={e.height}
                        amplitude={e.amplitude}
                        speed={e.speed}
                        paused={!isMobile}
                        isHorizontal={true}
                        waveSize={{
                            horizontal: horizontalWaveSize + "px",
                            vertical: verticalWaveSize + "px",
                        }}
                    />
                ))}
            </div>
        </>
    );
}
