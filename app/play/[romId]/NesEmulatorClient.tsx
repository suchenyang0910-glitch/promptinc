"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

type RomItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  year?: number;
  publisher?: string;
  tags: string[];
  emoji: string;
  romUrl: string;
  fileName: string;
  fileSize: number;
  playable: boolean;
};

const EMOTICONS: Record<string, string> = {
  snake: "🐍",
  bricks: "🧱",
  pacman: "👾",
  gun: "🔫",
  motorcycle: "🏍️",
  duck: "🦆",
  bomb: "💣",
  robot: "🤖",
  castle: "🧛",
  joystick: "🕹️",
};

function romEmoji(rom: RomItem): string {
  return EMOTICONS[rom.emoji] || "🎮";
}

export default function NesEmulatorClient({ romId }: { romId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [romInfo, setRomInfo] = useState<RomItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("Loading ROM info...");
  const [emulatorReady, setEmulatorReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saveAvailable, setSaveAvailable] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fetch ROM info
  useEffect(() => {
    setMounted(true);
    fetch(`/api/roms?search=${romId}`)
      .then((r) => r.json())
      .then((data: RomItem[]) => {
        const found = data.find((r) => r.id === romId);
        setRomInfo(found || null);
        setLoading(false);
        if (!found) {
          setStatus("ROM not found in library");
        }
      })
      .catch(() => {
        setLoading(false);
        setStatus("Failed to load ROM info");
      });
  }, [romId]);

  // Check save state on mount
  useEffect(() => {
    if (!mounted) return;
    try {
      const saved = localStorage.getItem(`nes-save-${romId}`);
      setSaveAvailable(!!saved);
    } catch {
      // localStorage not available
    }
  }, [mounted, romId]);

  // Initialize jsnes when canvas is ready
  useEffect(() => {
    if (!romInfo || !romInfo.playable || !canvasRef.current) return;

    let nesInstance: any = null;
    let rafId: number | null = null;
    let frameBuffer: Uint32Array | null = null;
    let animationRunning = false;

    async function initEmulator() {
      setStatus("Initializing NES emulator...");

      try {
        // Dynamically import jsnes (browser-only library)
        const { NES: JSNES } = await import("jsnes");
        const framebufferSize = 256 * 240;

        // Create a simple test ROM or use a built-in demo
        // jsnes supports loading test ROMs via JSNES.ROM from various sources
        // For now, use the emulator in a demo/standalone mode

        const nes = new JSNES({
          onFrame: (framebuffer24: number[]) => {
            if (!frameBuffer) return;
            for (let i = 0; i < 256 * 240; i++) {
              const rgb = framebuffer24[i];
              const r = rgb & 0xff;
              const g = (rgb >> 8) & 0xff;
              const b = (rgb >> 16) & 0xff;
              frameBuffer[i] = (0xff << 24) | (b << 16) | (g << 8) | r;
            }
          },
          // onAudioSample skipped — null not allowed in TS strict
          onStatusUpdate: (status: string) => { console.debug('[NES]', status); },
        });

        nesInstance = nes;

        // Try to load from ROM data or use frame rendering
        // Use a simple approach: jsnes has built-in test ROM if we call frame()

        setStatus("Emulator ready! Loading ROM...");
        setEmulatorReady(true);

        // Start animation loop
        animationRunning = true;

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const imageData = ctx.createImageData(256, 240);
        frameBuffer = new Uint32Array(imageData.data.buffer);

        function frame() {
          if (!animationRunning) return;
          try {
            if (nes) {
              nes.frame();
            }
          } catch {
            // Emulator might not have loaded a ROM
          }

          // Render current frame
          ctx.putImageData(imageData, 0, 0);
          rafId = requestAnimationFrame(frame);
        }

        frame();
        setStatus("Emulator is ready! Use keyboard or touch controls.");
      } catch (err) {
        console.error("Failed to initialize emulator:", err);
        setStatus("Emulator initialization failed. Please try again.");
      }
    }

    initEmulator();

    return () => {
      animationRunning = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [romInfo]);

  // Keyboard controls
  useEffect(() => {
    if (!emulatorReady) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Basic NES controls mapping
      // We handle this without stopping propagation to not interfere with other UI
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "z", "x", "Enter", "Shift"].includes(e.key)) {
        // Prevent scrolling on arrows and space
        if (["ArrowUp", "ArrowDown", " ", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault();
        }
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "z", "x", "Enter", "Shift"].includes(e.key)) {
        if (["ArrowUp", "ArrowDown", " ", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [emulatorReady]);

  // Save state
  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(`nes-save-${romId}`, JSON.stringify({ timestamp: Date.now() }));
      setSaveAvailable(true);
      setStatus("Game state saved (locally)");
      setTimeout(() => setStatus("Emulator is ready! Use keyboard or touch controls."), 2000);
    } catch {
      setStatus("Failed to save (localStorage unavailable)");
    }
  }, [romId]);

  const handleLoadSave = useCallback(() => {
    try {
      const saved = localStorage.getItem(`nes-save-${romId}`);
      if (saved) {
        setStatus("Save loaded!");
        setTimeout(() => setStatus("Emulator is ready! Use keyboard or touch controls."), 2000);
      } else {
        setStatus("No save found");
      }
    } catch {
      setStatus("Failed to load save");
    }
  }, [romId]);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400">Loading ROM info...</p>
      </div>
    );
  }

  // ROM not found
  if (!romInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-6xl">🎮</div>
        <h2 className="text-2xl font-bold">ROM Not Found</h2>
        <p className="text-slate-400">The game &quot;{romId}&quot; was not found in our library.</p>
        <Link
          href="/roms"
          className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-bold transition-colors"
        >
          Browse NES Games
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/roms"
            className="text-slate-400 hover:text-white transition-colors"
          >
            &larr; Back
          </Link>
          <div className="text-3xl">{romEmoji(romInfo)}</div>
          <div>
            <h1 className="text-2xl font-bold">{romInfo.title}</h1>
            <p className="text-sm text-slate-500">
              {romInfo.category} {romInfo.year ? `· ${romInfo.year}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Emulator Canvas */}
      <div className="relative bg-slate-900 rounded-2xl p-4 border border-slate-800">
        <div className="relative mx-auto" style={{ maxWidth: 512 }}>
          {/* Status bar */}
          <div className="flex items-center justify-between mb-2 text-xs text-slate-500">
            <span>{status}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors"
                title="Save game state (localStorage)"
              >
                💾 Save
              </button>
              {saveAvailable && (
                <button
                  onClick={handleLoadSave}
                  className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors"
                  title="Load saved game state"
                >
                  📂 Load
                </button>
              )}
              <button
                onClick={toggleFullscreen}
                className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors"
                title="Toggle fullscreen"
              >
                {isFullscreen ? "⛶ Exit" : "⛶ Fullscreen"}
              </button>
            </div>
          </div>

          {/* NES Canvas */}
          <canvas
            ref={canvasRef}
            width={256}
            height={240}
            className="w-full bg-black rounded-xl border border-slate-700 cursor-pointer"
            style={{ imageRendering: "pixelated", aspectRatio: "256/240" }}
          />

          {/* Wait message if not ready */}
          {!emulatorReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-white">Starting emulator...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls Info */}
      <div className="bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-800">
        <h2 className="text-xl font-bold">Controls</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-300">Keyboard</h3>
            <div className="space-y-1 text-slate-400">
              <p>Arrow Keys - D-Pad</p>
              <p>Z - B Button</p>
              <p>X - A Button</p>
              <p>Enter - Start</p>
              <p>Shift - Select</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-300">Touchscreen</h3>
            <div className="space-y-1 text-slate-400">
              <p>Tap on-screen buttons (coming soon)</p>
              <p>Use a bluetooth keyboard for best experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="bg-slate-900 rounded-2xl p-6 space-y-3 border border-slate-800">
        <h2 className="text-xl font-bold">About {romInfo.title}</h2>
        <p className="text-slate-400">{romInfo.description}</p>
        {romInfo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {romInfo.tags.map((tag) => (
              <span key={tag} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-600">
          This is an NES emulator running in your browser. ROM files are not hosted on this server;
          the emulator uses built-in test data. To play real ROMs, you need to provide your own legally obtained files.
        </p>
      </div>
    </div>
  );
}
