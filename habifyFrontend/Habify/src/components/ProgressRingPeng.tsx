// src/components/ProgressRingPeng.tsx
import React from "react";
import penguinBlue from "@/assets/penguin-idle.png";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  penguin?: string;
}

export const ProgressRingPeng: React.FC<ProgressRingProps> = ({
  progress,
  size = 180,
  strokeWidth = 12,
  penguin = penguinBlue,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Background Ring */}
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#7C3AED"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>

      {/* CENTERED PENGUIN */}
      <div
        className="
          absolute rounded-full overflow-hidden 
          flex items-center justify-center
        "
        style={{
          width: size * 0.45,
          height: size * 0.45,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src={penguin}
          alt="penguin"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};