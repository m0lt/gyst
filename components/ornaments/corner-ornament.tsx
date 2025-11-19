import React from "react";

interface CornerOrnamentProps {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  color?: string;
}

export const CornerOrnament: React.FC<CornerOrnamentProps> = ({
  className = "",
  position = "top-left",
  size = 80,
  color = "currentColor",
}) => {
  const rotations = {
    "top-left": 0,
    "top-right": 90,
    "bottom-right": 180,
    "bottom-left": 270,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotations[position]}deg)` }}
    >
      {/* Flowing curves inspired by Mucha's decorative borders */}
      <path
        d="M2 2C2 2 15 10 25 20C35 30 40 45 40 60"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M2 2C2 2 20 5 35 15C50 25 60 40 60 60"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Floral accent at the corner */}
      <circle cx="5" cy="5" r="3" fill={color} opacity="0.5" />
      <circle cx="12" cy="8" r="2" fill={color} opacity="0.4" />
      <circle cx="8" cy="12" r="2" fill={color} opacity="0.4" />

      {/* Decorative leaves */}
      <path
        d="M15 15C15 15 18 12 22 14C26 16 25 20 22 22"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M20 18C20 18 24 18 26 22C28 26 26 28 23 28"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.25"
      />

      {/* Fine detail lines */}
      <path
        d="M2 8C2 8 8 10 12 14"
        stroke={color}
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.2"
      />
      <path
        d="M8 2C8 2 10 8 14 12"
        stroke={color}
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.2"
      />
    </svg>
  );
};
