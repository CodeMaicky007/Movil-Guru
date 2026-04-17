"use client";

import MapLibreGL, { type PopupOptions, type MarkerOptions } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus, Locate, Maximize, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MapContextValue = {
  map: MapLibreGL.Map | null;
  isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

function useMap() {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within a Map component");
  return context;
}

const darkStyle = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

type MapProps = {
  children?: ReactNode;
} & Omit<MapLibreGL.MapOptions, "container" | "style">;

const DefaultLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#050d1f" }}>
    <div className="flex gap-1">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-2 rounded-full animate-pulse"
          style={{ background: "#CCFF00", animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
);

function Map({ children, ...props }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreGL.Map | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const mapInstance = new MapLibreGL.Map({
      container: containerRef.current,
      style: darkStyle,
      renderWorldCopies: false,
      attributionControl: { compact: true },
      ...props,
    });

    mapInstance.on("load", () => setIsLoaded(true));
    mapInstance.on("styledata", () => setIsStyleLoaded(true));
    mapRef.current = mapInstance;

    return () => {
      mapInstance.remove();
      mapRef.current = null;
    };
  }, [isMounted]);

  const isLoading = !isMounted || !isLoaded || !isStyleLoaded;

  return (
    <MapContext.Provider value={{ map: mapRef.current, isLoaded: isMounted && isLoaded && isStyleLoaded }}>
      <div ref={containerRef} className="relative w-full h-full">
        {isLoading && <DefaultLoader />}
        {isMounted && children}
      </div>
    </MapContext.Provider>
  );
}

type MarkerContextValue = {
  markerRef: React.RefObject<MapLibreGL.Marker | null>;
  markerElementRef: React.RefObject<HTMLDivElement | null>;
  map: MapLibreGL.Map | null;
  isReady: boolean;
};

const MarkerContext = createContext<MarkerContextValue | null>(null);

function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) throw new Error("Marker components must be used within MapMarker");
  return context;
}

type MapMarkerProps = {
  longitude: number;
  latitude: number;
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
} & Omit<MarkerOptions, "element">;

function MapMarker({ longitude, latitude, children, onClick, onMouseEnter, onMouseLeave, ...markerOptions }: MapMarkerProps) {
  const { map, isLoaded } = useMap();
  const markerRef = useRef<MapLibreGL.Marker | null>(null);
  const markerElementRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoaded || !map) return;

    const container = document.createElement("div");
    markerElementRef.current = container;

    const marker = new MapLibreGL.Marker({ ...markerOptions, element: container })
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    const handleClick = (e: MouseEvent) => onClick?.(e);
    const handleEnter = (e: MouseEvent) => onMouseEnter?.(e);
    const handleLeave = (e: MouseEvent) => onMouseLeave?.(e);

    container.addEventListener("click", handleClick);
    container.addEventListener("mouseenter", handleEnter);
    container.addEventListener("mouseleave", handleLeave);
    setIsReady(true);

    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("mouseenter", handleEnter);
      container.removeEventListener("mouseleave", handleLeave);
      marker.remove();
      markerRef.current = null;
      markerElementRef.current = null;
      setIsReady(false);
    };
  }, [map, isLoaded]);

  useEffect(() => { markerRef.current?.setLngLat([longitude, latitude]); }, [longitude, latitude]);

  return (
    <MarkerContext.Provider value={{ markerRef, markerElementRef, map, isReady }}>
      {children}
    </MarkerContext.Provider>
  );
}

type MarkerContentProps = { children?: ReactNode; className?: string };

function MarkerContent({ children, className }: MarkerContentProps) {
  const { markerElementRef, isReady } = useMarkerContext();
  if (!isReady || !markerElementRef.current) return null;
  return createPortal(
    <div className={cn("relative cursor-pointer", className)}>{children}</div>,
    markerElementRef.current
  );
}

type MarkerTooltipProps = {
  children: ReactNode;
  className?: string;
} & Omit<PopupOptions, "className" | "closeButton" | "closeOnClick">;

function MarkerTooltip({ children, className, ...popupOptions }: MarkerTooltipProps) {
  const { markerRef, markerElementRef, map, isReady } = useMarkerContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<MapLibreGL.Popup | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isReady || !markerRef.current || !markerElementRef.current || !map) return;

    const container = document.createElement("div");
    containerRef.current = container;

    const popup = new MapLibreGL.Popup({ offset: 16, ...popupOptions, closeOnClick: true, closeButton: false })
      .setMaxWidth("none")
      .setDOMContent(container);

    popupRef.current = popup;
    const markerElement = markerElementRef.current;
    const marker = markerRef.current;

    const handleEnter = () => popup.setLngLat(marker.getLngLat()).addTo(map);
    const handleLeave = () => popup.remove();

    markerElement.addEventListener("mouseenter", handleEnter);
    markerElement.addEventListener("mouseleave", handleLeave);
    setMounted(true);

    return () => {
      markerElement.removeEventListener("mouseenter", handleEnter);
      markerElement.removeEventListener("mouseleave", handleLeave);
      popup.remove();
      containerRef.current = null;
      setMounted(false);
    };
  }, [isReady, map]);

  if (!mounted || !containerRef.current) return null;

  return createPortal(
    <div className={cn("rounded-lg px-3 py-2 text-xs font-bold shadow-lg", className)}
      style={{ background: "#CCFF00", color: "#000" }}>
      {children}
    </div>,
    containerRef.current
  );
}

const positionClasses = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-10 right-2",
};

type MapControlsProps = {
  position?: keyof typeof positionClasses;
  showZoom?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
  className?: string;
  onLocate?: (coords: { longitude: number; latitude: number }) => void;
};

function ControlButton({ onClick, label, children, disabled = false }: {
  onClick: () => void; label: string; children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick} aria-label={label} type="button" disabled={disabled}
      className="flex items-center justify-center size-9 transition-colors"
      style={{ background: "rgba(0,0,0,0.8)", color: disabled ? "#444" : "#CCFF00", cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {children}
    </button>
  );
}

function MapControls({ position = "bottom-right", showZoom = true, showLocate = false, showFullscreen = false, className, onLocate }: MapControlsProps) {
  const { map, isLoaded } = useMap();
  const [waitingForLocation, setWaitingForLocation] = useState(false);

  const handleZoomIn = useCallback(() => map?.zoomTo(map.getZoom() + 1, { duration: 300 }), [map]);
  const handleZoomOut = useCallback(() => map?.zoomTo(map.getZoom() - 1, { duration: 300 }), [map]);

  const handleLocate = useCallback(() => {
    setWaitingForLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { longitude: pos.coords.longitude, latitude: pos.coords.latitude };
          map?.flyTo({ center: [coords.longitude, coords.latitude], zoom: 14, duration: 1500 });
          onLocate?.(coords);
          setWaitingForLocation(false);
        },
        () => setWaitingForLocation(false)
      );
    }
  }, [map, onLocate]);

  const handleFullscreen = useCallback(() => {
    const container = map?.getContainer();
    if (!container) return;
    document.fullscreenElement ? document.exitFullscreen() : container.requestFullscreen();
  }, [map]);

  if (!isLoaded) return null;

  return (
    <div className={cn("absolute z-10 flex flex-col gap-1", positionClasses[position], className)}>
      {showZoom && (
        <div className="flex flex-col rounded-lg overflow-hidden border border-white/10">
          <ControlButton onClick={handleZoomIn} label="Zoom in"><Plus className="size-4" /></ControlButton>
          <div className="h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          <ControlButton onClick={handleZoomOut} label="Zoom out"><Minus className="size-4" /></ControlButton>
        </div>
      )}
      {showLocate && (
        <div className="flex flex-col rounded-lg overflow-hidden border border-white/10">
          <ControlButton onClick={handleLocate} label="Mi ubicación" disabled={waitingForLocation}>
            {waitingForLocation ? <Loader2 className="size-4 animate-spin" /> : <Locate className="size-4" />}
          </ControlButton>
        </div>
      )}
      {showFullscreen && (
        <div className="flex flex-col rounded-lg overflow-hidden border border-white/10">
          <ControlButton onClick={handleFullscreen} label="Pantalla completa"><Maximize className="size-4" /></ControlButton>
        </div>
      )}
    </div>
  );
}

export { Map, useMap, MapMarker, MarkerContent, MarkerTooltip, MapControls };
