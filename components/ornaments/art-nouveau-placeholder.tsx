export function ArtNouveauPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Art Nouveau ornamental frame */}
        <path
          d="M50 10 Q 30 10 20 20 Q 10 30 10 50 Q 10 70 20 80 Q 30 90 50 90 Q 70 90 80 80 Q 90 70 90 50 Q 90 30 80 20 Q 70 10 50 10 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className="text-primary/30"
        />

        {/* Flowing floral lines */}
        <path
          d="M50 30 Q 40 35 35 45 Q 32 52 35 58 Q 40 65 50 70"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary/20"
        />
        <path
          d="M50 30 Q 60 35 65 45 Q 68 52 65 58 Q 60 65 50 70"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary/20"
        />

        {/* Center ornament */}
        <circle cx="50" cy="50" r="8" fill="currentColor" className="text-primary/15" />
        <circle cx="50" cy="50" r="4" fill="currentColor" className="text-primary/25" />

        {/* Decorative corner elements */}
        <path
          d="M20 20 Q 15 25 20 30"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary/20"
        />
        <path
          d="M80 20 Q 85 25 80 30"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary/20"
        />
        <path
          d="M20 80 Q 15 75 20 70"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary/20"
        />
        <path
          d="M80 80 Q 85 75 80 70"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary/20"
        />
      </svg>
    </div>
  );
}
