import React, { ReactNode } from "react";
import { CornerOrnament } from "./corner-ornament";

interface DecorativeFrameProps {
  children: ReactNode;
  className?: string;
  showCorners?: boolean;
  cornerSize?: number;
  cornerColor?: string;
}

export const DecorativeFrame: React.FC<DecorativeFrameProps> = ({
  children,
  className = "",
  showCorners = true,
  cornerSize = 60,
  cornerColor = "hsl(var(--primary) / 0.3)",
}) => {
  return (
    <div className={`relative ${className}`}>
      {showCorners && (
        <>
          {/* Top-left corner */}
          <div className="absolute top-2 left-2 pointer-events-none">
            <CornerOrnament
              position="top-left"
              size={cornerSize}
              color={cornerColor}
            />
          </div>

          {/* Top-right corner */}
          <div className="absolute top-2 right-2 pointer-events-none">
            <CornerOrnament
              position="top-right"
              size={cornerSize}
              color={cornerColor}
            />
          </div>

          {/* Bottom-left corner */}
          <div className="absolute bottom-2 left-2 pointer-events-none">
            <CornerOrnament
              position="bottom-left"
              size={cornerSize}
              color={cornerColor}
            />
          </div>

          {/* Bottom-right corner */}
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <CornerOrnament
              position="bottom-right"
              size={cornerSize}
              color={cornerColor}
            />
          </div>
        </>
      )}

      {/* Content */}
      {children}
    </div>
  );
};
