export type Team = "A" | "B";
export type Direction = 1 | -1;

export const RING_SIZE = 12;
export const QUAN_L = 0;
export const QUAN_R = 6;
export const QUAN_INDICES: readonly number[] = [QUAN_L, QUAN_R];
export const TEAM_INDICES: Record<Team, number[]> = {
  A: [1, 2, 3, 4, 5],
  B: [7, 8, 9, 10, 11],
};
export const INITIAL_DAN_STONES = 5;
export const QUAN_POINT_VALUE = 10;
export const SUPPORT_STOCK_START = 10;
export const CLOSED = -1;

export function createRing(): number[] {
  const ring = new Array(RING_SIZE).fill(INITIAL_DAN_STONES);
  ring[QUAN_L] = 0;
  ring[QUAN_R] = 0;
  return ring;
}

export interface TeamState {
  name: string;
  points: number;
  basket: number;
  quanCaptured: number;
  borrowed: boolean;
  turnsUsed: number;
}

export function createTeam(name: string): TeamState {
  return { name, points: 0, basket: 0, quanCaptured: 0, borrowed: false, turnsUsed: 0 };
}

function isClosed(ring: number[], idx: number): boolean {
  return ring[idx] === CLOSED;
}

function stepIndex(ring: number[], from: number, dir: Direction): number {
  let idx = from;
  let guard = 0;
  do {
    idx = (idx + dir + RING_SIZE) % RING_SIZE;
    guard += 1;
  } while (isClosed(ring, idx) && guard <= RING_SIZE * 2);
  return idx;
}

export interface SowStep {
  ring: number[];
  highlight: number;
}

export interface CaptureInfo {
  index: number;
  amount: number;
  isQuan: boolean;
}

export interface SowResult {
  ring: number[];
  steps: SowStep[];
  captures: CaptureInfo[];
}

/** Pure simulation of one sow (and any resulting captures/continuations). */
export function sow(
  ring: number[],
  startIndex: number,
  direction: Direction,
  advanced: boolean,
): SowResult {
  const working = [...ring];
  const steps: SowStep[] = [];
  const captures: CaptureInfo[] = [];

  let pos = startIndex;
  const seeds = working[startIndex];
  working[startIndex] = 0;

  let safety = 0;
  const SAFETY_CAP = 500;

  const sowPile = (from: number, count: number) => {
    let p = from;
    let s = count;
    while (s > 0 && safety < SAFETY_CAP) {
      p = stepIndex(working, p, direction);
      working[p] += 1;
      steps.push({ ring: [...working], highlight: p });
      s -= 1;
      safety += 1;
    }
    return p;
  };

  pos = sowPile(pos, seeds);

  while (safety < SAFETY_CAP) {
    safety += 1;
    const next1 = stepIndex(working, pos, direction);

    if (working[next1] === 0) {
      const next2 = stepIndex(working, next1, direction);
      if (working[next2] > 0 && !isClosed(working, next2)) {
        const isQuan = QUAN_INDICES.includes(next2);
        const amount = working[next2];
        working[next2] = isQuan ? CLOSED : 0;
        captures.push({ index: next2, amount, isQuan });
        steps.push({ ring: [...working], highlight: next2 });
        if (!advanced || isQuan) break;
        pos = next2;
        continue;
      }
      break;
    }

    if (!advanced) break;

    const pickup = working[next1];
    working[next1] = 0;
    steps.push({ ring: [...working], highlight: next1 });
    pos = sowPile(next1, pickup);
  }

  return { ring: working, steps, captures };
}

export function applyCaptures(team: TeamState, captures: CaptureInfo[]): TeamState {
  let { points, basket, quanCaptured } = team;
  for (const c of captures) {
    if (c.isQuan) {
      quanCaptured += 1;
      points += QUAN_POINT_VALUE;
    } else {
      basket += c.amount;
      points += c.amount;
    }
  }
  return { ...team, points, basket, quanCaptured };
}

export function isRowEmpty(ring: number[], team: Team): boolean {
  return TEAM_INDICES[team].every((i) => ring[i] === 0);
}

export interface RefillResult {
  ring: number[];
  team: TeamState;
  supportStock: number;
  possible: boolean;
}

export function refillRow(
  ring: number[],
  team: TeamState,
  supportStock: number,
  teamId: Team,
): RefillResult {
  const working = [...ring];
  const cells = TEAM_INDICES[teamId];
  let nextTeam = { ...team };
  let nextStock = supportStock;
  let possible = true;

  if (team.points >= cells.length) {
    nextTeam = { ...nextTeam, points: nextTeam.points - cells.length };
  } else if (supportStock >= cells.length) {
    nextStock -= cells.length;
    nextTeam = { ...nextTeam, borrowed: true };
  } else {
    possible = false;
  }

  if (possible) {
    for (const idx of cells) working[idx] = 1;
  }

  return { ring: working, team: nextTeam, supportStock: nextStock, possible };
}

export function bothQuanClosed(ring: number[]): boolean {
  return ring[QUAN_L] === CLOSED && ring[QUAN_R] === CLOSED;
}

export function finalizeTeam(ring: number[], team: TeamState, teamId: Team): TeamState {
  const remaining = TEAM_INDICES[teamId].reduce((sum, i) => sum + Math.max(ring[i], 0), 0);
  let points = team.points + remaining;
  if (team.borrowed) points -= QUAN_POINT_VALUE;
  return { ...team, points };
}

/** Display order (left to right) for each row, reversed on team B's side to mirror the real board. */
export const DISPLAY_ORDER: Record<Team, number[]> = {
  A: TEAM_INDICES.A,
  B: [...TEAM_INDICES.B].reverse(),
};
