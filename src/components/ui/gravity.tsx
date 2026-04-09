"use client";

import {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type PhysicsLib = typeof import("matter-js");

function calculatePosition(
  value: number | string | undefined,
  containerSize: number,
  elementSize: number
) {
  if (typeof value === "string" && value.endsWith("%")) {
    const percentage = parseFloat(value) / 100;
    return containerSize * percentage;
  }
  return typeof value === "number"
    ? value
    : elementSize - containerSize + elementSize / 2;
}

type GravityProps = {
  children: ReactNode;
  debug?: boolean;
  gravity?: { x: number; y: number };
  addTopWall?: boolean;
  autoStart?: boolean;
  className?: string;
};

type MatterBodyProps = {
  children: ReactNode;
  matterBodyOptions?: Record<string, unknown>;
  isDraggable?: boolean;
  bodyType?: "rectangle" | "circle";
  x?: number | string;
  y?: number | string;
  angle?: number;
  className?: string;
};

export type GravityRef = {
  start: () => void;
  stop: () => void;
};

type GravityContextValue = {
  registerElement: (id: string, element: HTMLElement, props: MatterBodyProps) => void;
  unregisterElement: (id: string) => void;
  engineReady: boolean;
};

const GravityContext = createContext<GravityContextValue | null>(null);

export const MatterBody = ({
  children,
  className,
  matterBodyOptions = { friction: 0.3, restitution: 0.4, density: 0.002, isStatic: false },
  bodyType = "rectangle",
  isDraggable = true,
  x = 0,
  y = 0,
  angle = 0,
}: MatterBodyProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(GravityContext);

  useEffect(() => {
    if (!elementRef.current || !context || !context.engineReady) return;
    const id = idRef.current;
    const el = elementRef.current;
    context.registerElement(id, el, {
      children,
      matterBodyOptions,
      bodyType,
      isDraggable,
      x,
      y,
      angle,
    });
    return () => context.unregisterElement(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.engineReady]);

  return (
    <div
      ref={elementRef}
      className={cn("absolute top-0 left-0", className)}
      style={{ transform: "translate(-9999px, -9999px)" }}
    >
      {children}
    </div>
  );
};

export const Gravity = forwardRef<GravityRef, GravityProps>(
  (
    {
      children,
      debug = false,
      gravity = { x: 0, y: 1 },
      addTopWall = false,
      autoStart = true,
      className,
    },
    ref
  ) => {
    const canvas = useRef<HTMLDivElement>(null);
    const engineRef = useRef<any>(null);
    const renderRef = useRef<any>(null);
    const runnerRef = useRef<any>(null);
    const matterRef = useRef<PhysicsLib | null>(null);
    const bodiesMap = useRef(new Map<string, { element: HTMLElement; body: any }>());
    const frameId = useRef<number>(0);
    const [engineReady, setEngineReady] = useState(false);

    // Animation loop to sync React elements with physics bodies
    const updateElements = useCallback(() => {
      bodiesMap.current.forEach(({ element, body }) => {
        const { x, y } = body.position;
        const rotation = body.angle * (180 / Math.PI);
        element.style.transform = `translate(${x - element.offsetWidth / 2}px, ${
          y - element.offsetHeight / 2
        }px) rotate(${rotation}deg)`;
      });
      frameId.current = requestAnimationFrame(updateElements);
    }, []);

    const registerElement = useCallback(
      (id: string, element: HTMLElement, props: MatterBodyProps) => {
        const M = matterRef.current;
        if (!canvas.current || !M || !engineRef.current) return;

        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const canvasRect = canvas.current.getBoundingClientRect();
        const angle = ((props.angle ?? 0) * Math.PI) / 180;
        const x = calculatePosition(props.x, canvasRect.width, width);
        const y = calculatePosition(props.y, canvasRect.height, height);

        const bodyOpts = {
          ...(props.matterBodyOptions ?? {}),
          angle,
          render: {
            fillStyle: debug ? "#888" : "#0000",
            strokeStyle: debug ? "#333" : "#0000",
            lineWidth: debug ? 3 : 0,
          },
        };

        const body =
          props.bodyType === "circle"
            ? M.Bodies.circle(x, y, Math.max(width, height) / 2, bodyOpts)
            : M.Bodies.rectangle(x, y, width, height, bodyOpts);

        M.World.add(engineRef.current.world, [body]);
        bodiesMap.current.set(id, { element, body });

        // Immediately set initial position so the element appears in place
        const rotation = body.angle * (180 / Math.PI);
        element.style.transform = `translate(${x - width / 2}px, ${
          y - height / 2
        }px) rotate(${rotation}deg)`;
      },
      [debug]
    );

    const unregisterElement = useCallback((id: string) => {
      const M = matterRef.current;
      const entry = bodiesMap.current.get(id);
      if (entry && M && engineRef.current) {
        M.World.remove(engineRef.current.world, entry.body);
        bodiesMap.current.delete(id);
      }
    }, []);

    const startEngine = useCallback(() => {
      const M = matterRef.current;
      if (!M || !runnerRef.current || !renderRef.current || !engineRef.current) return;
      runnerRef.current.enabled = true;
      M.Runner.run(runnerRef.current, engineRef.current);
      M.Render.run(renderRef.current);
      cancelAnimationFrame(frameId.current);
      frameId.current = requestAnimationFrame(updateElements);
    }, [updateElements]);

    const stopEngine = useCallback(() => {
      const M = matterRef.current;
      if (!M) return;
      if (runnerRef.current) M.Runner.stop(runnerRef.current);
      if (renderRef.current) M.Render.stop(renderRef.current);
      if (frameId.current) cancelAnimationFrame(frameId.current);
    }, []);

    // Load Matter.js + setup engine (once)
    useEffect(() => {
      let cancelled = false;

      import("matter-js").then((M) => {
        if (cancelled || !canvas.current) return;
        matterRef.current = M as unknown as PhysicsLib;

        const w = canvas.current.offsetWidth;
        const h = canvas.current.offsetHeight;

        const engine = M.Engine.create();
        engine.gravity.x = gravity.x;
        engine.gravity.y = gravity.y;
        engineRef.current = engine;

        const render = M.Render.create({
          element: canvas.current,
          engine,
          options: { width: w, height: h, wireframes: false, background: "#00000000" },
        });
        renderRef.current = render;

        // IMPORTANT: attach mouse to the container div, NOT render.canvas.
        // render.canvas is a child element whose CSS size may differ from the physics
        // world coordinate space (DPR scaling, etc.), causing a hit-area mismatch.
        // The container div always has the correct client size — coordinates match.
        const mouse = M.Mouse.create(canvas.current);

        // The render canvas is purely visual; let pointer events fall through to the div.
        render.canvas.style.pointerEvents = "none";

        const mouseConstraint = M.MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.2, render: { visible: debug } },
        });

        const walls = [
          M.Bodies.rectangle(w / 2, h + 10, w, 20, {
            isStatic: true,
            render: { visible: debug },
          }),
          M.Bodies.rectangle(w + 10, h / 2, 20, h, {
            isStatic: true,
            render: { visible: debug },
          }),
          M.Bodies.rectangle(-10, h / 2, 20, h, {
            isStatic: true,
            render: { visible: debug },
          }),
        ];
        if (addTopWall) {
          walls.push(
            M.Bodies.rectangle(w / 2, -10, w, 20, {
              isStatic: true,
              render: { visible: debug },
            })
          );
        }

        M.World.add(engine.world, [mouseConstraint, ...walls]);
        render.mouse = mouse;

        // Cursor feedback so users know they can drag bodies
        M.Events.on(mouseConstraint, "startdrag", () => {
          if (canvas.current) canvas.current.style.cursor = "grabbing";
        });
        M.Events.on(mouseConstraint, "enddrag", () => {
          if (canvas.current) canvas.current.style.cursor = "grab";
        });
        M.Events.on(engine, "beforeUpdate", () => {
          if (!canvas.current) return;
          const touching = M.Query.point(
            engine.world.bodies.filter((b: any) => !b.isStatic),
            mouse.position
          );
          if (touching.length > 0 && mouse.button === -1) {
            canvas.current.style.cursor = "grab";
          } else if (touching.length === 0 && mouse.button === -1) {
            canvas.current.style.cursor = "default";
          }
        });

        runnerRef.current = M.Runner.create();
        runnerRef.current.enabled = false;

        M.Render.run(render);

        if (autoStart) {
          runnerRef.current.enabled = true;
          M.Runner.run(runnerRef.current, engine);
          cancelAnimationFrame(frameId.current);
          frameId.current = requestAnimationFrame(updateElements);
        }

        setEngineReady(true);
      });

      return () => {
        cancelled = true;
        const M = matterRef.current;
        if (frameId.current) cancelAnimationFrame(frameId.current);
        if (M && runnerRef.current) M.Runner.stop(runnerRef.current);
        if (M && renderRef.current) {
          M.Render.stop(renderRef.current);
          renderRef.current.canvas?.remove();
        }
        if (M && engineRef.current) {
          M.World.clear(engineRef.current.world, false);
          M.Engine.clear(engineRef.current);
        }
        bodiesMap.current.clear();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(
      ref,
      () => ({ start: startEngine, stop: stopEngine }),
      [startEngine, stopEngine]
    );

    const contextValue = useMemo<GravityContextValue>(
      () => ({ registerElement, unregisterElement, engineReady }),
      [registerElement, unregisterElement, engineReady]
    );

    return (
      <GravityContext.Provider value={contextValue}>
        <div
          ref={canvas}
          className={cn("absolute top-0 left-0 w-full h-full", className)}
        >
          {children}
        </div>
      </GravityContext.Provider>
    );
  }
);

Gravity.displayName = "Gravity";
