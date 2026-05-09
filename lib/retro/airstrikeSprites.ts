export type PlayerShipKind = "arrow" | "delta";
export type EnemyShipKind = "dart" | "saucer" | "bomber";

export function drawPlayerShip(ctx: CanvasRenderingContext2D, kind: PlayerShipKind) {
  if (kind === "delta") {
    const ship = ctx.createLinearGradient(0, -16, 0, 14);
    ship.addColorStop(0, "#93c5fd");
    ship.addColorStop(1, "#1d4ed8");
    ctx.fillStyle = ship;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(14, 14);
    ctx.lineTo(0, 8);
    ctx.lineTo(-14, 14);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(226,232,240,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "rgba(59,130,246,0.85)";
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(4, 6);
    ctx.lineTo(0, 4);
    ctx.lineTo(-4, 6);
    ctx.closePath();
    ctx.fill();
    return;
  }

  const ship = ctx.createLinearGradient(0, -16, 0, 16);
  ship.addColorStop(0, "#bfdbfe");
  ship.addColorStop(1, "#2563eb");
  ctx.fillStyle = ship;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(9, 10);
  ctx.lineTo(3, 16);
  ctx.lineTo(0, 10);
  ctx.lineTo(-3, 16);
  ctx.lineTo(-9, 10);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(226,232,240,0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function drawEnemyShip(ctx: CanvasRenderingContext2D, kind: EnemyShipKind) {
  if (kind === "saucer") {
    const grad = ctx.createLinearGradient(0, -10, 0, 12);
    grad.addColorStop(0, "#fb7185");
    grad.addColorStop(1, "#be123c");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 2, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(253,230,138,0.35)";
    ctx.beginPath();
    ctx.ellipse(0, -3, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(253,230,138,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 2, 14, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }

  if (kind === "bomber") {
    const grad = ctx.createLinearGradient(0, -14, 0, 16);
    grad.addColorStop(0, "#fda4af");
    grad.addColorStop(1, "#9f1239");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(12, 6);
    ctx.lineTo(12, -6);
    ctx.lineTo(0, -14);
    ctx.lineTo(-12, -6);
    ctx.lineTo(-12, 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(15,23,42,0.35)";
    ctx.fillRect(-4, -2, 8, 10);
    ctx.strokeStyle = "rgba(253,230,138,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();
    return;
  }

  const grad = ctx.createLinearGradient(0, -12, 0, 16);
  grad.addColorStop(0, "#fb7185");
  grad.addColorStop(1, "#be123c");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, 16);
  ctx.lineTo(11, -10);
  ctx.lineTo(0, -4);
  ctx.lineTo(-11, -10);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(253,230,138,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function drawBullet(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(34,197,94,0.8)";
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(x - 1.6, y - 12, 3.2, 14);
  ctx.restore();
}

export function drawFlame(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(-4, 14);
  ctx.lineTo(0, 22);
  ctx.lineTo(4, 14);
  ctx.closePath();
  const flame = ctx.createLinearGradient(0, 14, 0, 22);
  flame.addColorStop(0, "rgba(251,191,36,0.95)");
  flame.addColorStop(1, "rgba(239,68,68,0.5)");
  ctx.fillStyle = flame;
  ctx.fill();
}

