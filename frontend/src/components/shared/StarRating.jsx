import { Star } from "lucide-react";
import { useState } from "react";

// Read-only when `onChange` is omitted; interactive otherwise.
function StarRating({ value = 0, onChange, disabled = false, size = "size-5" }) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === "function";
  const shown = hover || value || 0;

  return (
    <div className="inline-flex items-center gap-0.5" role={interactive ? "radiogroup" : "img"} aria-label={`Rating: ${value || 0} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <Star className={`${size} ${n <= shown ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />;
        return interactive ? (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            role="radio"
            aria-checked={value === n}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}

export default StarRating;
