import { Scatter } from "react-chartjs-2";

export default function ScatterPlot({ data }) {
    const chartData = {
        datasets: [
            {
                label: "Data Points",
                data: data.map((point) => ({ x: point.Component_1, y: point.Component_2 })),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
        ],
    };

    const options = {
        scales: {
            x: { title: { display: true, text: "Component 1" } },
            y: { title: { display: true, text: "Component 2" } },
        },
    };

    return <Scatter data={chartData} options={options} />;
}