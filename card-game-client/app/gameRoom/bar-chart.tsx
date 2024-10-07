import React, { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
);

interface AnswerEvent {
    event: string;
    data: string;
    nickname?: string;
}

interface ShowAnswersChartProps {
    allAnswers: AnswerEvent[];
    onClose: () => void;
    answer?: string;
}

const ShowAnswersChart: React.FC<ShowAnswersChartProps> = ({
    allAnswers,
    onClose,
    answer,
}) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                chartRef.current &&
                !chartRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const answerCounts: { [answer: string]: number } = {};

    allAnswers.forEach((answerEvent) => {
        if (answerEvent.event === "answerClick") {
            const splitData = answerEvent.data.split(" ");
            const answer = splitData.slice(2).join(" ");
            answerCounts[answer] = (answerCounts[answer] || 0) + 1;
        }
    });

    const labels = Object.keys(answerCounts);
    const data = {
        labels,
        datasets: [
            {
                label: "Number of Responses",
                data: labels.map((label) => answerCounts[label]),
                backgroundColor: "rgba(75,192,192,0.6)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: function (value: number | string) {
                        return Number(value).toFixed(0);
                    },
                },
            },
        },
    };

    return (
        <div ref={chartRef} className="relative p-4 bg-gray-200 rounded-lg">
            <p className="text-sm font-semibold">Correct Answer: {answer}</p>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ShowAnswersChart;
