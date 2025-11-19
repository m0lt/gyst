import React from "react";

interface DividerOrnamentProps {
  className?: string;
  width?: string | number;
  height?: number;
  color?: string;
  variant?: "simple" | "floral" | "geometric";
}

export const DividerOrnament: React.FC<DividerOrnamentProps> = ({
  className = "",
  width = "100%",
  height = 40,
  color = "currentColor",
  variant = "floral",
}) => {
  const renderSimple = () => (
    <>
      {/* Simple flowing line with dots */}
      <line
        x1="0"
        y1="20"
        x2="100"
        y2="20"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
      />
      <circle cx="50" cy="20" r="4" fill={color} opacity="0.5" />
      <circle cx="30" cy="20" r="2" fill={color} opacity="0.4" />
      <circle cx="70" cy="20" r="2" fill={color} opacity="0.4" />
    </>
  );

  const renderFloral = () => (
    <>
      {/* Central floral motif */}
      <circle cx="50" cy="20" r="5" fill={color} opacity="0.5" />
      <path
        d="M45 20C45 20 42 15 40 12C38 9 35 8 33 10"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M55 20C55 20 58 15 60 12C62 9 65 8 67 10"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M50 15C50 15 48 10 45 8"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M50 15C50 15 52 10 55 8"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Side decorations */}
      <path
        d="M10 20C10 20 20 18 30 20C35 21 40 22 45 22"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M90 20C90 20 80 18 70 20C65 21 60 22 55 22"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Small accent dots */}
      <circle cx="25" cy="20" r="2" fill={color} opacity="0.4" />
      <circle cx="75" cy="20" r="2" fill={color} opacity="0.4" />
    </>
  );

  const renderGeometric = () => (
    <>
      {/* Geometric Art Nouveau pattern */}
      <path
        d="M0 20L20 20"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.3"
      />
      <path
        d="M80 20L100 20"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.3"
      />
      <rect
        x="45"
        y="15"
        width="10"
        height="10"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        opacity="0.5"
        transform="rotate(45 50 20)"
      />
      <circle cx="30" cy="20" r="3" fill={color} opacity="0.4" />
      <circle cx="70" cy="20" r="3" fill={color} opacity="0.4" />
      <path
        d="M35 20C35 20 40 16 45 18"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M65 20C65 20 60 16 55 18"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
    </>
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {variant === "simple" && renderSimple()}
      {variant === "floral" && renderFloral()}
      {variant === "geometric" && renderGeometric()}
    </svg>
  );
};
