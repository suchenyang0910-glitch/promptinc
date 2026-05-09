export type Piece = {
  shape: number[][][];
  rot: number;
  x: number;
  y: number;
  id: number;
};

export const TETRIS_W = 10;
export const TETRIS_H = 20;
export const TETRIS_CELL = 20;

const SHAPES: Array<number[][][]> = [
  [
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]],
  ],
  [[[1, 1], [1, 1]]],
  [
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]],
  ],
  [
    [[1, 0, 0], [1, 1, 1]],
    [[1, 1], [1, 0], [1, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[0, 1], [0, 1], [1, 1]],
  ],
  [
    [[0, 0, 1], [1, 1, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1], [0, 1], [0, 1]],
  ],
  [
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]],
  ],
  [
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]],
  ],
];

export function emptyBoard() {
  return Array.from({ length: TETRIS_H }, () => Array.from({ length: TETRIS_W }, () => 0));
}

export function collides(board: number[][], piece: Piece) {
  const mat = piece.shape[piece.rot];
  for (let y = 0; y < mat.length; y += 1) {
    for (let x = 0; x < mat[y].length; x += 1) {
      if (!mat[y][x]) continue;
      const bx = piece.x + x;
      const by = piece.y + y;
      if (bx < 0 || bx >= TETRIS_W || by >= TETRIS_H) return true;
      if (by >= 0 && board[by][bx]) return true;
    }
  }
  return false;
}

export function stamp(board: number[][], piece: Piece) {
  const next = board.map((r) => r.slice());
  const mat = piece.shape[piece.rot];
  for (let y = 0; y < mat.length; y += 1) {
    for (let x = 0; x < mat[y].length; x += 1) {
      if (!mat[y][x]) continue;
      const bx = piece.x + x;
      const by = piece.y + y;
      if (by >= 0 && by < TETRIS_H && bx >= 0 && bx < TETRIS_W) next[by][bx] = piece.id;
    }
  }
  return next;
}

export function clearLines(board: number[][]) {
  const kept = board.filter((row) => row.some((c) => c === 0));
  const cleared = TETRIS_H - kept.length;
  while (kept.length < TETRIS_H) kept.unshift(Array.from({ length: TETRIS_W }, () => 0));
  return { board: kept, cleared };
}

export function newPiece(): Piece {
  const idx = Math.floor(Math.random() * SHAPES.length);
  const shape = SHAPES[idx];
  const mat = shape[0];
  const x = Math.floor((TETRIS_W - mat[0].length) / 2);
  return { shape, rot: 0, x, y: -2, id: idx + 1 };
}

export function drawTetris(canvas: HTMLCanvasElement, board: number[][], piece: Piece | null) {
  const ctx = canvas.getContext("2d");
  if (ctx === null) return;
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const colors = [
    "#000000",
    "#60a5fa",
    "#fbbf24",
    "#a78bfa",
    "#34d399",
    "#fb7185",
    "#f97316",
    "#22c55e",
  ];

  function drawCell(cctx: CanvasRenderingContext2D, x: number, y: number, id: number) {
    const c = colors[id] ?? "#e5e7eb";
    cctx.fillStyle = c;
    cctx.fillRect(x * TETRIS_CELL + 1, y * TETRIS_CELL + 1, TETRIS_CELL - 2, TETRIS_CELL - 2);
  }

  for (let y = 0; y < TETRIS_H; y += 1) {
    for (let x = 0; x < TETRIS_W; x += 1) {
      const v = board[y][x];
      if (v) drawCell(ctx, x, y, v);
    }
  }

  if (piece) {
    const mat = piece.shape[piece.rot];
    for (let y = 0; y < mat.length; y += 1) {
      for (let x = 0; x < mat[y].length; x += 1) {
        if (!mat[y][x]) continue;
        const bx = piece.x + x;
        const by = piece.y + y;
        if (by >= 0) drawCell(ctx, bx, by, piece.id);
      }
    }
  }
}
