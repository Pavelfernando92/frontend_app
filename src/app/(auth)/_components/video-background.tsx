"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasMediaQueryResolved, setHasMediaQueryResolved] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    // Marca cuando ya se resolvió la media query en cliente
    setHasMediaQueryResolved(true);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error al reproducir el video automáticamente:", error);
      });
    }
  }, [isMobile]);

  // No renderizar nada hasta que sepamos si es mobile o no
  if (!hasMediaQueryResolved) return null;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {!isVideoLoaded && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse"></div>
      )}

      <video
        ref={videoRef}
        className="absolute min-w-full min-h-full w-auto h-auto object-cover"
        muted
        loop
        playsInline
        autoPlay
        onLoadedData={() => setIsVideoLoaded(true)}
        poster="/placeholder.svg?height=1080&width=1920"
      >
        <source
          src={
            isMobile
              ? "/videos/lotuss-video-mobile.mp4"
              : "/videos/lotuss-video.mp4"
          }
          type="video/mp4"
        />
        Tu navegador no soporta videos HTML5.
      </video>
    </div>
  );
}
