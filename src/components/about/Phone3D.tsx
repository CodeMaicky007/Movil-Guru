"use client";
import { useEffect, useState } from "react";
import Phone3DClient from "./Phone3DClient";

type Props = {
  progress?: number;
  staticPose?: "hero" | "vision";
  className?: string;
  ariaHidden?: boolean;
};

/**
 * Mount-gated R3F phone. Server + initial hydration render a transparent
 * placeholder; the Canvas mounts only on the client after useEffect fires.
 * Avoids next/dynamic + SSR: false bailout inside "use client" trees.
 */
export default function Phone3D({ progress, staticPose, className, ariaHidden = true }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={className} aria-hidden={ariaHidden}>
      {mounted && <Phone3DClient progress={progress} staticPose={staticPose} />}
    </div>
  );
}
