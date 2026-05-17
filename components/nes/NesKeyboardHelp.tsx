export default function NesKeyboardHelp() {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="rounded-xl bg-slate-950/40 border border-slate-800 p-3">
        <div className="text-xs text-slate-400">方向</div>
        <div className="mt-1 font-semibold">方向键 / WASD</div>
      </div>
      <div className="rounded-xl bg-slate-950/40 border border-slate-800 p-3">
        <div className="text-xs text-slate-400">A</div>
        <div className="mt-1 font-semibold">X / K</div>
      </div>
      <div className="rounded-xl bg-slate-950/40 border border-slate-800 p-3">
        <div className="text-xs text-slate-400">B</div>
        <div className="mt-1 font-semibold">Z / J</div>
      </div>
      <div className="rounded-xl bg-slate-950/40 border border-slate-800 p-3">
        <div className="text-xs text-slate-400">Start</div>
        <div className="mt-1 font-semibold">Enter</div>
      </div>
      <div className="rounded-xl bg-slate-950/40 border border-slate-800 p-3">
        <div className="text-xs text-slate-400">Select</div>
        <div className="mt-1 font-semibold">Shift</div>
      </div>
    </div>
  );
}

