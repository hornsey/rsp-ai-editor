"use client";

import { useState, useRef, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let newPosition = ((clientX - rect.left) / rect.width) * 100;
    if (newPosition < 0) newPosition = 0;
    if (newPosition > 100) newPosition = 100;
    setPosition(newPosition);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="before-after-slider rounded-xl shadow-lg aspect-[4/3] relative overflow-hidden cursor-ew-resize"
    >
      {/* After Image (Background) */}
      <div className="absolute inset-0">
        <img className="w-full h-full object-cover" src={afterSrc} alt={afterAlt} />
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          className="w-full h-full object-cover grayscale brightness-75"
          src={beforeSrc}
          alt={beforeAlt}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="slider-handle"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      />

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/40 text-white px-4 py-1 rounded-full text-sm backdrop-blur-md">
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-primary/80 text-white px-4 py-1 rounded-full text-sm backdrop-blur-md">
        Enhanced
      </div>
    </div>
  );
}
