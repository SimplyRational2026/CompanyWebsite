"use client";

import { useRef, useState } from "react";

export default function VideoPlayer({
  src,
  poster,
  radius,
  label = "Video",
}: {
  src: string;
  poster?: string;
  radius: number;
  label?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-purple-deep"
      style={{ borderRadius: radius }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="none"
        className="h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        className="group absolute inset-0 flex items-center justify-center focus:outline-none"
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-black/30 transition-opacity duration-200 ${
            playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        />

        <span
          aria-hidden
          className={`pointer-events-none relative flex aspect-square w-1/4 max-w-20 min-w-11 items-center justify-center rounded-full bg-white/95 text-purple-deep shadow-lg transition-all duration-200 ${
            playing
              ? "scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
              : "scale-100 opacity-100"
          }`}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-2/5 w-2/5">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-2/5 w-2/5">
              <path d="M7 5.5v13a1 1 0 0 0 1.5.87l10-6.5a1 1 0 0 0 0-1.74l-10-6.5A1 1 0 0 0 7 5.5Z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
