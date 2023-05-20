import React from "react";
import StatGauge from "./StatGauge";

interface GaugeProps {
  label: string;
  value: number;
}

const Gauge: React.FC<GaugeProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col items-center">
      <StatGauge value={value} />
      <p className="mt-2 text-gray-700">{label}</p>
    </div>
  );
};

export default Gauge;
