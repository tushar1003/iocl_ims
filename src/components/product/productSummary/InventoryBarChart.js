import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import './InventoryBarChart.css'
function ReBarChart({totalProducts,totalOutOfStock}) {
    const data = [
        {
          name: "Total",
          uv: totalProducts,
        },
        {
          name: "Out of Stock",
          uv: totalOutOfStock,
        },
      ];
  return (
    <div className="graph">
      <BarChart width={350} height={100} data={data}>
      <XAxis dataKey='name' />
      <YAxis dataKey='uv' />
        <Bar dataKey="uv" fill="#8884d8" />
      </BarChart>
    </div>
  );
}
export default ReBarChart;