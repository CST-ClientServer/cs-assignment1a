import React from "react";

interface TimerBarProps {
    timeLeft: number;
    timeLimit: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ timeLeft, timeLimit }) => {
    return (
        <div className="w-full pt-6 flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                        width: `${(timeLeft / timeLimit) * 100}%`,
                        transition: "width 0.5s ease-in-out",
                    }}
                ></div>
            </div>
        </div>
    );
};

export default TimerBar;
