"use client";

import createGlobe, { COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, PointerEvent } from "react";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;
const CLICK_THRESHOLD_MS = 200; // Max time for a click
const CLICK_THRESHOLD_PX = 5; // Max distance for a click

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.4,
  mapSamples: 36000,
  mapBrightness: 1.8,
  baseColor: [1, 1, 1],
  markerColor: [255 / 254, 29 / 255, 29 / 255],
  glowColor: [0.99, 0, 0],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const [isAbsolute, setIsAbsolute] = useState(false);
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const pointerDownTime = useRef<number | null>(null);
  const pointerDownPosition = useRef<{ x: number; y: number } | null>(null);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 10,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.005;
        state.phi = phi + rs.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    // Keep the initial fade-in for the canvas itself
    setTimeout(() => {
        if (canvasRef.current) {
            canvasRef.current.style.opacity = "1";
        }
    }, 0);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rs, config]); // Note: Added eslint-disable-next-line as `width` and `phi` are intentionally not dependencies here based on original logic

  return (
    <div
      className={cn(
        // Base styles for the container DIV
        "relative inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]", // Ensure relative positioning for base state if needed
        // Add transition properties for smooth animation
        "transition-all duration-1500 ease-in-out", // Animate all applicable properties over 0.5s
        // Conditional styles based on isAbsolute state
        isAbsolute
          ? "absolute top-[50%] left-[50%] opacity-50 z-10" // State when clicked: absolute, semi-transparent, higher z-index
          : "opacity-100 z-10", // Default state: fully opaque, default z-index (or adjust z-0 if needed)
        className,
      )}
    >
      <canvas
        // Note: The canvas opacity is handled separately by the useEffect for initial load fade-in
        // We don't need to transition opacity here again unless the goal changes.
        className={cn(
          "size-full opacity-0 [contain:layout_paint_size]", // Initial opacity 0, fades in via useEffect
          // Removed transition-opacity from here as the parent div handles the toggle animation
        )}
        ref={canvasRef}
        onPointerDown={(e: PointerEvent<HTMLCanvasElement>) => {
          pointerDownTime.current = Date.now();
          pointerDownPosition.current = { x: e.clientX, y: e.clientY };
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={(e: PointerEvent<HTMLCanvasElement>) => {
          const downTime = pointerDownTime.current;
          const downPos = pointerDownPosition.current;
          if (
            downTime &&
            downPos &&
            Date.now() - downTime < CLICK_THRESHOLD_MS &&
            Math.abs(e.clientX - downPos.x) < CLICK_THRESHOLD_PX &&
            Math.abs(e.clientY - downPos.y) < CLICK_THRESHOLD_PX
          ) {
            setIsAbsolute((prev) => !prev);
          }
          updatePointerInteraction(null);
          pointerDownTime.current = null;
          pointerDownPosition.current = null;
          pointerInteractionMovement.current = 0;
        }}
        onPointerOut={(e: PointerEvent<HTMLCanvasElement>) => {
          updatePointerInteraction(null);
          pointerDownTime.current = null;
          pointerDownPosition.current = null;
          pointerInteractionMovement.current = 0;
        }}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
