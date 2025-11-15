import React from "react";

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;    // width/height of the ring
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  backgroundColor = "#E5E7EB", // Light gray
  progressColor = "#7C3AED", // Purple
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg height={size} width={size} className="drop-shadow-md">
      <circle
        stroke={backgroundColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />

      <circle
        stroke={progressColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          transition: "stroke-dashoffset 0.5s ease",
        }}
      />

      {/* Text Percentage */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.3em"
        fontSize="20"
        fontWeight="bold"
        fill="#4B5563"
      >
        {progress}%
      </text>
    </svg>
  );
};
