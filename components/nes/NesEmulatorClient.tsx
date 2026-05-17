"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { NES, Controller } from "jsnes";

import NesKeyboardHelp from "@/components/nes/NesKeyboardHelp";
import NesTouchControls, { type NesTouchKey } from "@/components/nes/NesTouchControls";
import { sampleRoms } from "@/lib/nes/sampleRoms";

type RunStatus = "idle" | "loading" | "running" | "paused" | "error";

function u8ToBinaryString(bytes: Uint8Array): string {
  const chunk = 0x8000;
  let out = "";
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, i + chunk);
    out += String.fromCharCode(...slice);
  }
  return out;
}

function isLikelyNesFile(name: string): boolean {
  const n = name.trim().toLowerCase();
  return n.endsWith(".nes");
}

function keyToControllerButton(key: string): number | null {
  switch (key) {
    case "ArrowUp":
    case "w":
      return Controller.BUTTON_UP;
    case "ArrowDown":
    case "s":
      return Controller.BUTTON_DOWN;
    case "ArrowLeft":
    case "a":
      return Controller.BUTTON_LEFT;
    case "ArrowRight":
    case "d":
      return Controller.BUTTON_RIGHT;
    case "j":
    case "z":
      return Controller.BUTTON_B;
    case "k":
    case "x":
      return Controller.BUTTON_A;
    case "Enter":
      return Controller.BUTTON_START;
    case "Shift":
      return Controller.BUTTON_SELECT;
    default:
      return null;
  }
}

function touchKeyToControllerButton(key: NesTouchKey): number {
  switch (key) {
    case "up":
      return Controller.BUTTON_UP;
    case "down":
      return Controller.BUTTON_DOWN;
    case "left":
      return Controller.BUTTON_LEFT;
    case "right":
      return Controller.BUTTON_RIGHT;
    case "a":
      return Controller.BUTTON_A;
    case "b":
      return Controller.BUTTON_B;
    case "start":
      return Controller.BUTTON_START;
    case "select":
      return Controller.BUTTON_SELECT;
  }
}

type Props = {
  selectedRomId?: string;
};

export default function NesEmulatorClient({ selectedRomId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const frameU32Ref = useRef<Uint32Array | null>(null);
  const nesRef = useRef<InstanceType<typeof NES> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameMsRef = useRef<number>(0);
  const runningRef = useRef(false);

  const [status, setStatus] = useState<RunStatus>("idle");
  const [loadedName, setLoadedName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isTouchUI] = useState(() => (navigator.maxTouchPoints ?? 0) > 0);

  // 如果有传入的ROM ID，自动加载该ROM
  useEffect(() => {
    if (selectedRomId && status === "idle") {
      onLoadSample(selectedRomId);
    }
  }, [selectedRomId]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case "idle":
        return "Not loaded";
      case "loading":
        return "Loading";
      case "running":
        return "Running";
      case "paused":
        return "Paused";
      case "error":
        return "Error";
    }
  }, [status]);

  const stopLoop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current != null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const ensureCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!ctxRef.current) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctxRef.current = ctx;
    }

    if (!imageDataRef.current) {
      canvas.width = 256;
      canvas.height = 240;
      const ctx = ctxRef.current;
      if (!ctx) return;
      imageDataRef.current = ctx.getImageData(0, 0, 256, 240);
      frameU32Ref.current = new Uint32Array(imageDataRef.current.data.buffer);
    }
  }, []);

  const drawFrame = useCallback(() => {
    const ctx = ctxRef.current;
    const img = imageDataRef.current;
    if (!ctx || !img) return;
    ctx.putImageData(img, 0, 0);
  }, []);

  const createNes = useCallback(() => {
    ensureCanvas();

    const frameU32 = frameU32Ref.current;
    if (!frameU32) return null;

    const nes = new NES({
      onFrame(framebuffer24: number[]) {
        for (let i = 0; i < 256 * 240; i++) {
          frameU32[i] = 0xff000000 | framebuffer24[i];
        }
      },
      onStatusUpdate() {},
    });

    return nes;
  }, [ensureCanvas]);

  const startLoop = useCallback(() => {
    if (!nesRef.current) return;
    if (runningRef.current) return;

    runningRef.current = true;
    lastFrameMsRef.current = performance.now();

    const tick = () => {
      if (!runningRef.current) return;
      const nes = nesRef.current;
      if (!nes) return;

      const now = performance.now();
      const frameMs = 1000 / 60;
      const maxFrames = 4;
      let steps = 0;

      while (now - lastFrameMsRef.current >= frameMs && steps < maxFrames) {
        nes.frame();
        lastFrameMsRef.current += frameMs;
        steps++;
      }

      drawFrame();
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }, [drawFrame]);

  const reset = useCallback(() => {
    stopLoop();
    nesRef.current = null;
    setStatus("idle");
    setLoadedName("");
    setError("");
    ensureCanvas();
    const frameU32 = frameU32Ref.current;
    if (frameU32) frameU32.fill(0xff000000);
    drawFrame();
  }, [drawFrame, ensureCanvas, stopLoop]);

  const loadFromBytes = useCallback(
    async (name: string, bytes: Uint8Array) => {
      try {
        setError("");
        setStatus("loading");
        setLoadedName(name);

        stopLoop();
        const nes = createNes();
        if (!nes) throw new Error("Failed to initialize canvas");

        const romString = u8ToBinaryString(bytes);
        nes.loadROM(romString);
        nesRef.current = nes;

        setStatus("running");
        startLoop();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load";
        setStatus("error");
        setError(msg);
      }
    },
    [createNes, startLoop, stopLoop]
  );

  const onUpload = useCallback(
    async (file: File | null) => {
      if (!file) return;
      if (!isLikelyNesFile(file.name)) {
        setStatus("error");
        setError("Only .nes files are supported");
        return;
      }
      const buf = await file.arrayBuffer();
      await loadFromBytes(file.name, new Uint8Array(buf));
    },
    [loadFromBytes]
  );

  const onLoadSample = useCallback(
    async (id: string) => {
      const sample = sampleRoms.find((s) => s.id === id);
      if (!sample) return;
      try {
        setError("");
        setStatus("loading");
        setLoadedName(sample.title);
        const res = await fetch(sample.url, { cache: "force-cache" });
        if (!res.ok) throw new Error(`Download failed (${res.status})`);
        const buf = await res.arrayBuffer();
        await loadFromBytes(sample.title, new Uint8Array(buf));
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load";
        setStatus("error");
        setError(msg);
      }
    },
    [loadFromBytes]
  );

  const togglePause = useCallback(() => {
    if (status === "running") {
      stopLoop();
      setStatus("paused");
      return;
    }
    if (status === "paused") {
      setStatus("running");
      startLoop();
    }
  }, [startLoop, status, stopLoop]);

  const buttonDown = useCallback((btn: number) => {
    const nes = nesRef.current;
    if (!nes) return;
    nes.buttonDown(1, btn);
  }, []);

  const buttonUp = useCallback((btn: number) => {
    const nes = nesRef.current;
    if (!nes) return;
    nes.buttonUp(1, btn);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const btn = keyToControllerButton(key);
      if (btn == null) return;
      e.preventDefault();
      buttonDown(btn);
    }

    function onKeyUp(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const btn = keyToControllerButton(key);
      if (btn == null) return;
      e.preventDefault();
      buttonUp(btn);
    }

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [buttonDown, buttonUp]);

  useEffect(() => {
    ensureCanvas();
    const frameU32 = frameU32Ref.current;
    if (frameU32) frameU32.fill(0xff000000);
    drawFrame();
    return () => stopLoop();
  }, [drawFrame, ensureCanvas, stopLoop]);

  // 如果是独立运行页面（有selectedRomId），使用简化的UI
  if (selectedRomId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
        {/* 控制按钮 */}
        <div className="w-full max-w-[768px] flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-400">Status</div>
            <div className="font-bold" data-testid="nes-status">
              {statusLabel}{loadedName ? ` · ${loadedName}` : ""}
            </div>
            {status === "error" && <div className="mt-2 text-sm text-red-400">{error}</div>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePause}
              disabled={status !== "running" && status !== "paused"}
              className="rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-60 px-4 py-2 text-sm font-semibold transition-colors"
            >
              {status === "paused" ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-xl bg-gray-800 hover:bg-gray-700 px-4 py-2 text-sm font-semibold transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* 游戏画布 */}
        <div className="w-full max-w-[768px] rounded-2xl border border-gray-800 bg-black p-3">
          <div className="aspect-[256/240]">
            <canvas
              ref={canvasRef}
              className="block w-full h-full rounded-xl"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>

        {/* 触屏控制器 */}
        {isTouchUI && (
          <div className="w-full max-w-[768px]">
            <NesTouchControls
              onDown={(k) => buttonDown(touchKeyToControllerButton(k))}
              onUp={(k) => buttonUp(touchKeyToControllerButton(k))}
            />
          </div>
        )}

        {/* 键盘帮助 */}
        {!isTouchUI && (
          <div className="w-full max-w-[768px] bg-gray-900 rounded-2xl border border-gray-800 p-4">
            <NesKeyboardHelp />
          </div>
        )}
      </div>
    );
  }

  // 原始的/nes页面UI
  return (
    <section className="grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-sm text-slate-400">Status</div>
              <div className="font-bold" data-testid="nes-status">
                {statusLabel}{loadedName ? ` · ${loadedName}` : ""}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePause}
                disabled={status !== "running" && status !== "paused"}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-60 px-3 py-2 text-sm font-semibold"
              >
                {status === "paused" ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm font-semibold"
              >
                Reset
              </button>
            </div>
          </div>

          {status === "error" ? <div className="mt-3 text-sm text-red-300">{error}</div> : null}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-black p-3">
          <div className="w-full max-w-[768px] mx-auto">
            <div className="aspect-[256/240]">
              <canvas
                ref={canvasRef}
                className="block w-full h-full rounded-xl"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
        </div>

        {isTouchUI ? (
          <NesTouchControls
            onDown={(k) => buttonDown(touchKeyToControllerButton(k))}
            onUp={(k) => buttonUp(touchKeyToControllerButton(k))}
          />
        ) : null}
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
          <div className="font-bold">Instant Play (Redistribution-Friendly ROMs)</div>
          <div className="space-y-3">
            {sampleRoms.map((s) => (
              <div key={s.id} className="rounded-xl bg-slate-950/40 border border-slate-800 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{s.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{s.description}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLoadSample(s.id)}
                    className="shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-sm font-bold"
                    data-testid={`nes-sample-${s.id}`}
                  >
                    Play
                  </button>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  License: {" "}
                  <a href={s.licenseUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">
                    {s.licenseName}
                  </a>
                  {" · Source: "}
                  <a href={s.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">
                    {s.sourceLabel}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
          <div className="font-bold">Upload a Local ROM</div>
          <div className="text-sm text-slate-300">Select a local .nes file (not uploaded to any server).</div>
          <label className="block">
            <span className="sr-only">Select ROM file</span>
            <input
              type="file"
              accept=".nes,.NES"
              onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
              className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700 text-slate-300"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
          <div className="font-bold">Controls</div>
          <NesKeyboardHelp />
          <div className="text-xs text-slate-400">
            Tip: to prevent page scrolling, arrow keys and other inputs are captured by this page.
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300 leading-6">
          This page does not provide commercial ROM downloads. Sample ROMs include license/source links. Uploaded ROMs are read and run locally in your browser.
        </div>
      </aside>
    </section>
  );
}
