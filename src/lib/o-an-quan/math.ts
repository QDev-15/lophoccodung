export type MathOperationFilter = "all" | "+" | "-" | "×" | "÷";
export type TableFilter = "all" | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type RangeFilter = 10 | 20 | 50 | 100;
export type DifficultyFilter = "easy" | "advanced";

export interface MathSettings {
  operation: MathOperationFilter;
  table: TableFilter;
  range: RangeFilter;
  difficulty: DifficultyFilter;
}

export interface MathQuestion {
  prompt: string;
  answer: number;
  choices: number[];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildChoices(answer: number): number[] {
  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const delta = randInt(1, 6) * (Math.random() < 0.5 ? -1 : 1);
    const candidate = answer + delta;
    if (candidate !== answer && candidate >= 0) {
      distractors.add(candidate);
    }
  }
  return shuffle([answer, ...distractors]);
}

export function generateQuestion(settings: MathSettings): MathQuestion {
  const pool: Exclude<MathOperationFilter, "all">[] =
    settings.operation === "all" ? ["+", "-", "×", "÷"] : [settings.operation];
  const op = pool[randInt(0, pool.length - 1)];
  const tableNum = settings.table === "all" ? randInt(2, 9) : settings.table;
  const operandMax = settings.difficulty === "easy" ? 10 : 12;

  let a: number;
  let b: number;
  let answer: number;
  let prompt: string;

  switch (op) {
    case "+": {
      a = randInt(1, settings.range);
      b = randInt(1, settings.range);
      answer = a + b;
      prompt = `${a} + ${b} = ?`;
      break;
    }
    case "-": {
      a = randInt(1, settings.range);
      b = randInt(0, a);
      answer = a - b;
      prompt = `${a} - ${b} = ?`;
      break;
    }
    case "×": {
      b = randInt(1, operandMax);
      answer = tableNum * b;
      prompt = `${tableNum} × ${b} = ?`;
      break;
    }
    case "÷": {
      b = randInt(1, operandMax);
      const product = tableNum * b;
      answer = b;
      prompt = `${product} ÷ ${tableNum} = ?`;
      break;
    }
  }

  return { prompt, answer, choices: buildChoices(answer) };
}
