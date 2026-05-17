"use client";

import { useCallback, useMemo, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export type NesTouchKey = "up" | "down" | "left" | "right" | "a" | "b" | "start" | "select";

type Props = {
  onDown: (key: NesTouchKey) => void;
  onUp: (key: NesTouchKey) => void;
};

type PressMap = Map<number, NesTouchKey>;

function TouchButton({ label, k, onDown, onUp }: { label: string; k: NesTouchKey } & Props) {
  const pressRef = useRef<PressMap>(new Map());

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
      pressRef.current.set(e.pointerId, k);
      onDown(k);
    },
    [k, onDown]
  );

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      const key = pressRef.current.get(e.pointerId);
      pressRef.current.delete(e.pointerId);
      if (key) onUp(key);
    },
    [onUp]
  );

  const onPointerCancel = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      const key = pressRef.current.get(e.pointerId);
      pressRef.current.delete(e.pointerId);
      if (key) onUp(key);
    },
    [onUp]
  );

  return (
    <button
      type="button"
      className="select-none touch-none rounded-2xl border border-slate-700 bg-slate-900/80 active:bg-slate-800 text-white font-bold"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerCancel}
    >
      {label}
    </button>
  );
}

export default function NesTouchControls({ onDown, onUp }: Props) {
  const dpad = useMemo(
    () => [
      { label: "▲", k: "up" as const },
      { label: "◀", k: "left" as const },
      { label: "▶", k: "right" as const },
      { label: "▼", k: "down" as const },
    ],
    []
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-end justify-between gap-6">
        <div className="grid grid-cols-3 grid-rows-3 gap-2 w-[180px]">
          <div />
          <TouchButton label={dpad[0].label} k={dpad[0].k} onDown={onDown} onUp={onUp} />
          <div />
          <TouchButton label={dpad[1].label} k={dpad[1].k} onDown={onDown} onUp={onUp} />
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40" />
          <TouchButton label={dpad[2].label} k={dpad[2].k} onDown={onDown} onUp={onUp} />
          <div />
          <TouchButton label={dpad[3].label} k={dpad[3].k} onDown={onDown} onUp={onUp} />
          <div />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-2">
            <TouchButton label="SELECT" k="select" onDown={onDown} onUp={onUp} />
            <TouchButton label="START" k="start" onDown={onDown} onUp={onUp} />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-20">
              <TouchButton label="B" k="b" onDown={onDown} onUp={onUp} />
            </div>
            <div className="w-20 h-20">
              <TouchButton label="A" k="a" onDown={onDown} onUp={onUp} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
