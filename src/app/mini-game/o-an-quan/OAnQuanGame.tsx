"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  QUAN_L,
  QUAN_R,
  TEAM_INDICES,
  DISPLAY_ORDER,
  SUPPORT_STOCK_START,
  createRing,
  createTeam,
  sow,
  applyCaptures,
  isRowEmpty,
  refillRow,
  bothQuanClosed,
  finalizeTeam,
  type Team,
  type TeamState,
  type SowStep,
  type CaptureInfo,
} from "@/lib/o-an-quan/engine";
import { generateQuestion, type MathQuestion, type MathSettings, type MathOperationFilter, type TableFilter, type RangeFilter, type DifficultyFilter } from "@/lib/o-an-quan/math";
import { playCorrect, playWrong, playCapture, playSeed, playWin } from "@/lib/o-an-quan/sound";
import { IconChip } from "@/components/IconChip";

type Phase = "intro" | "setup" | "playing" | "finished";
type TurnPhase = "choose-cell" | "question" | "direction" | "animating" | "feedback-wrong";

interface GameSettings extends MathSettings {
  teamAName: string;
  teamBName: string;
  turnsPerTeam: number | "free";
  answerSeconds: number | "unlimited";
}

const DEFAULT_SETTINGS: GameSettings = {
  teamAName: "ĐỘI XANH",
  teamBName: "ĐỘI TÍM",
  operation: "+",
  table: "all",
  range: 10,
  difficulty: "easy",
  turnsPerTeam: 15,
  answerSeconds: 15,
};

// Two teams, two fixed identity colors (mint = Team A, lavender = Team B). `bloom` is
// reserved project-wide for upsell/monetization surfaces, so it never appears here.
const TEAM_TINT: Record<
  Team,
  { text: string; bg: string; bgLight: string; ring: string; gradient: string; chip: "mint" | "lavender" }
> = {
  A: {
    text: "text-(--color-mint-dark)",
    bg: "bg-(--color-mint-dark)",
    bgLight: "bg-(--color-mint-light)",
    ring: "ring-(--color-mint-dark)",
    gradient: "from-(--color-mint) to-(--color-mint-dark)",
    chip: "mint",
  },
  B: {
    text: "text-(--color-lavender)",
    bg: "bg-(--color-lavender)",
    bgLight: "bg-violet-100",
    ring: "ring-(--color-lavender)",
    gradient: "from-(--color-lavender) to-[#5b21b6]",
    chip: "lavender",
  },
};

// Bead colors cycle through the palette, minus `bloom` (reserved for upsell, never decorative).
const STONE_PALETTE = ["--color-mint", "--color-mint-dark", "--color-lavender", "--color-sun-dark", "--color-peach"];

function stoneColor(cellIndex: number, i: number) {
  return `var(${STONE_PALETTE[(cellIndex * 3 + i * 5) % STONE_PALETTE.length]})`;
}

// Deterministic "scattered pile" layout (percent offsets within a cell) so beads look
// hand-tossed rather than snapped to a perfect grid, without re-randomizing on every render.
const STONE_OFFSETS: Array<[number, number]> = [
  [50, 46], [33, 36], [67, 38], [40, 62], [61, 64],
  [23, 56], [77, 54], [50, 24], [35, 20], [65, 20],
  [17, 40], [83, 42], [50, 74], [29, 78], [71, 78], [50, 48],
];

export function OAnQuanGame() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [showInstructions, setShowInstructions] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- game state ---
  const [ring, setRing] = useState<number[]>(createRing());
  const [animFrame, setAnimFrame] = useState<number[] | null>(null);
  const [teamA, setTeamA] = useState<TeamState>(() => createTeam(DEFAULT_SETTINGS.teamAName));
  const [teamB, setTeamB] = useState<TeamState>(() => createTeam(DEFAULT_SETTINGS.teamBName));
  const [supportStock, setSupportStock] = useState(SUPPORT_STOCK_START);
  const [activeTeam, setActiveTeam] = useState<Team>("A");
  const [turnPhase, setTurnPhase] = useState<TurnPhase>("choose-cell");
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [feedbackReason, setFeedbackReason] = useState<"wrong" | "timeout" | null>(null);
  const [sowSteps, setSowSteps] = useState<SowStep[] | null>(null);
  const [sowStepIdx, setSowStepIdx] = useState(0);
  const [pendingCaptures, setPendingCaptures] = useState<CaptureInfo[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [winner, setWinner] = useState<"A" | "B" | "draw" | null>(null);

  const boardRing = animFrame ?? ring;

  function sfx(fn: () => void) {
    if (soundOn) fn();
  }

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }

  function toggleFullscreen() {
    const el = wrapperRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        void el.requestFullscreen?.();
      } else {
        void document.exitFullscreen?.();
      }
    } catch {
      // ignore unsupported fullscreen environments
    }
  }

  useEffect(() => {
    function onChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function startSetup() {
    setPhase("setup");
  }

  function startGame() {
    setRing(createRing());
    setAnimFrame(null);
    setTeamA(createTeam(settings.teamAName.trim() || "ĐỘI XANH"));
    setTeamB(createTeam(settings.teamBName.trim() || "ĐỘI TÍM"));
    setSupportStock(SUPPORT_STOCK_START);
    setActiveTeam("A");
    setTurnPhase("choose-cell");
    setSelectedCell(null);
    setQuestion(null);
    setSowSteps(null);
    setSowStepIdx(0);
    setPendingCaptures([]);
    setWinner(null);
    setPhase("playing");
  }

  function restart() {
    startGame();
  }

  const mathSettings: MathSettings = {
    operation: settings.operation,
    table: settings.table,
    range: settings.range,
    difficulty: settings.difficulty,
  };

  function endTurn(finalRing: number[], captures: CaptureInfo[]) {
    setSowSteps(null);
    setSowStepIdx(0);
    setAnimFrame(null);

    let nextRing = finalRing;
    let team = applyCaptures(activeTeam === "A" ? teamA : teamB, captures);
    team = { ...team, turnsUsed: team.turnsUsed + 1 };
    let stock = supportStock;
    let refillFailed = false;
    let refillMsg: string | null = null;

    if (isRowEmpty(nextRing, activeTeam)) {
      const refill = refillRow(nextRing, team, stock, activeTeam);
      nextRing = refill.ring;
      team = refill.team;
      stock = refill.supportStock;
      refillFailed = !refill.possible;
      if (refill.possible) {
        refillMsg = `🔄 ${team.name} hết sỏi, rải lại 5 ô!`;
      }
    }

    const nextTeamA = activeTeam === "A" ? team : teamA;
    const nextTeamB = activeTeam === "B" ? team : teamB;

    setRing(nextRing);
    setSupportStock(stock);
    if (activeTeam === "A") setTeamA(team);
    else setTeamB(team);

    const turnsDone =
      settings.turnsPerTeam !== "free" &&
      nextTeamA.turnsUsed >= settings.turnsPerTeam &&
      nextTeamB.turnsUsed >= settings.turnsPerTeam;

    if (bothQuanClosed(nextRing) || turnsDone || refillFailed) {
      finishGame(nextRing, nextTeamA, nextTeamB);
      return;
    }

    const capturedTotal = captures.reduce((s, c) => s + (c.isQuan ? 10 : c.amount), 0);
    if (capturedTotal > 0) {
      sfx(playCapture);
      showToast(`✨ ${team.name} ăn được ${capturedTotal} điểm!`);
    } else if (refillMsg) {
      showToast(refillMsg);
    }

    setSelectedCell(null);
    setQuestion(null);
    setFeedbackReason(null);
    setActiveTeam(activeTeam === "A" ? "B" : "A");
    setTurnPhase("choose-cell");
  }

  function finishGame(finalRing: number[], a: TeamState, b: TeamState) {
    const fa = finalizeTeam(finalRing, a, "A");
    const fb = finalizeTeam(finalRing, b, "B");
    setTeamA(fa);
    setTeamB(fb);
    setRing(finalRing);
    setWinner(fa.points === fb.points ? "draw" : fa.points > fb.points ? "A" : "B");
    sfx(playWin);
    setPhase("finished");
  }

  function handleCellClick(index: number) {
    if (phase !== "playing" || turnPhase !== "choose-cell") return;
    if (!TEAM_INDICES[activeTeam].includes(index)) return;
    if (ring[index] <= 0) return;

    setSelectedCell(index);
    setQuestion(generateQuestion(mathSettings));
    setFeedbackReason(null);
    setTurnPhase("question");
    setDeadline(settings.answerSeconds === "unlimited" ? null : Date.now() + settings.answerSeconds * 1000);
    setSecondsLeft(settings.answerSeconds === "unlimited" ? null : settings.answerSeconds);
  }

  function handleAnswer(choice: number) {
    if (turnPhase !== "question" || !question) return;
    const correct = choice === question.answer;
    if (correct) {
      sfx(playCorrect);
      setTurnPhase("direction");
    } else {
      sfx(playWrong);
      setFeedbackReason("wrong");
      setTurnPhase("feedback-wrong");
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => endTurn(ring, []), 1100);
    }
  }

  // question countdown
  useEffect(() => {
    if (turnPhase !== "question" || settings.answerSeconds === "unlimited" || deadline === null) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        sfx(playWrong);
        setFeedbackReason("timeout");
        setTurnPhase("feedback-wrong");
        if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
        feedbackTimer.current = setTimeout(() => endTurn(ring, []), 1100);
      }
    }, 200);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnPhase, deadline, settings.answerSeconds]);

  function handleDirection(dir: 1 | -1) {
    if (turnPhase !== "direction" || selectedCell === null) return;
    const result = sow(ring, selectedCell, dir, settings.difficulty === "advanced");
    setSowSteps(result.steps);
    setSowStepIdx(0);
    setAnimFrame(ring);
    setPendingCaptures(result.captures);
    setTurnPhase("animating");
  }

  // sowing animation playback
  useEffect(() => {
    if (turnPhase !== "animating" || !sowSteps) return;
    if (sowStepIdx >= sowSteps.length) {
      const finalRing = sowSteps.length > 0 ? sowSteps[sowSteps.length - 1].ring : ring;
      // Animation just finished playing; resolving the turn here is the intended
      // end-of-effect transition, not a derived-state update.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      endTurn(finalRing, pendingCaptures);
      return;
    }
    const timer = setTimeout(() => {
      setAnimFrame(sowSteps[sowStepIdx].ring);
      sfx(playSeed);
      setSowStepIdx((i) => i + 1);
    }, 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnPhase, sowStepIdx, sowSteps]);

  // Purely presentational: which cell is currently receiving a bead while the sowing
  // animation plays. Derived from existing state, not a new piece of game state.
  const highlightIndex =
    turnPhase === "animating" && sowSteps && sowStepIdx > 0
      ? sowSteps[Math.min(sowStepIdx - 1, sowSteps.length - 1)]?.highlight ?? null
      : null;

  return (
    <div
      ref={wrapperRef}
      className="relative min-h-[75vh] overflow-hidden rounded-[2rem] bg-(--color-cloud) p-4 shadow-[0_16px_40px_-16px_rgba(46,42,33,0.3)] sm:rounded-[2.5rem] md:p-6"
    >
      <TopBar
        onInstructions={() => setShowInstructions(true)}
        onFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((s) => !s)}
      />

      {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}

      {phase === "intro" && <IntroScreen onStart={startSetup} onInstructions={() => setShowInstructions(true)} />}

      {phase === "setup" && (
        <SetupScreen
          settings={settings}
          onChange={setSettings}
          onBack={() => setPhase("intro")}
          onStart={startGame}
        />
      )}

      {phase === "playing" && (
        <PlayScreen
          ring={boardRing}
          teamA={teamA}
          teamB={teamB}
          activeTeam={activeTeam}
          turnPhase={turnPhase}
          selectedCell={selectedCell}
          highlightIndex={highlightIndex}
          question={question}
          secondsLeft={secondsLeft}
          answerSeconds={settings.answerSeconds}
          turnsPerTeam={settings.turnsPerTeam}
          supportStock={supportStock}
          toast={toast}
          feedbackReason={feedbackReason}
          onCellClick={handleCellClick}
          onAnswer={handleAnswer}
          onDirection={handleDirection}
        />
      )}

      {phase === "finished" && (
        <FinishedScreen teamA={teamA} teamB={teamB} winner={winner} onRestart={restart} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Decorative village backdrop — shared across intro / setup / playing.
// No illustration assets exist in this codebase; the "village" feel is built
// entirely from layered CSS gradients, blurred color blobs, emoji and a tiny
// hand-rolled inline SVG hut.
// ---------------------------------------------------------------------------

function ThatchedHut({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} role="presentation" aria-hidden="true">
      <polygon points="60,6 112,46 8,46" fill="#c88a4a" stroke="#8a5a28" strokeWidth="3" strokeLinejoin="round" />
      <rect x="24" y="46" width="72" height="46" rx="4" fill="#fde8c9" stroke="#b9823f" strokeWidth="3" />
      <rect x="50" y="62" width="20" height="30" rx="3" fill="#8a5a28" />
      <rect x="32" y="58" width="14" height="14" rx="2" fill="#dcfce7" stroke="#8a5a28" strokeWidth="2" />
      <rect x="74" y="58" width="14" height="14" rx="2" fill="#dcfce7" stroke="#8a5a28" strokeWidth="2" />
    </svg>
  );
}

function VillageScene({ variant = "flat" }: { variant?: "rich" | "flat" }) {
  const rich = variant === "rich";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          rich
            ? "from-(--color-mint-light) via-white to-(--color-sun)/15"
            : "from-white via-(--color-mint-light)/40 to-(--color-cloud)"
        }`}
      />
      <div className="absolute -top-10 right-8 size-40 rounded-full bg-(--color-sun)/35 blur-3xl" />
      <div className="absolute left-[12%] top-6 h-8 w-24 rounded-full bg-white/70 blur-md" />
      <div className="absolute right-[22%] top-4 h-6 w-20 rounded-full bg-white/60 blur-md" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-(--color-mint-light) to-transparent" />
      <span className="animate-leaf-sway absolute left-[4%] bottom-0 text-6xl opacity-80 sm:text-7xl">🎋</span>
      <span className="animate-leaf-sway absolute right-[5%] bottom-0 text-5xl opacity-70 sm:text-6xl" style={{ animationDelay: "1.2s" }}>
        🎋
      </span>
      {rich && (
        <>
          <span className="animate-float absolute bottom-2 left-[14%] text-7xl sm:text-8xl">🌳</span>
          <span className="absolute bottom-10 left-[19%] text-2xl">🐔</span>
          <span className="absolute bottom-7 left-[23%] text-lg">🐥</span>
          <ThatchedHut className="absolute bottom-0 right-[8%] h-24 w-28 sm:h-28 sm:w-32" />
          <span className="absolute bottom-1 left-[6%] text-2xl">🌼</span>
          <span className="absolute bottom-1 left-[45%] text-2xl">🌼</span>
          <span className="absolute bottom-1 right-[20%] text-2xl">🌼</span>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top bar
// ---------------------------------------------------------------------------

function ChromePill({
  href,
  onClick,
  children,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const classes =
    "inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-(--color-ink) shadow-[0_2px_0_rgba(46,42,33,0.1),0_6px_14px_-4px_rgba(46,42,33,0.28)] transition hover:-translate-y-0.5 active:translate-y-0";
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

function IconCircleButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-full bg-white text-lg text-(--color-ink) shadow-[0_2px_0_rgba(46,42,33,0.1),0_6px_14px_-4px_rgba(46,42,33,0.28)] transition hover:-translate-y-0.5 active:translate-y-0"
    >
      {children}
    </button>
  );
}

function TopBar({
  onInstructions,
  onFullscreen,
  isFullscreen,
  soundOn,
  onToggleSound,
}: {
  onInstructions: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  return (
    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <ChromePill href="/mini-game">← Về Mini game</ChromePill>
        <IconCircleButton onClick={onFullscreen} label="Toàn màn hình">
          {isFullscreen ? "⤢" : "⛶"}
        </IconCircleButton>
        <ChromePill onClick={onInstructions}>📖 Hướng dẫn chi tiết</ChromePill>
      </div>
      <ChromePill onClick={onToggleSound}>{soundOn ? "🔊 Âm thanh: Bật" : "🔇 Âm thanh: Tắt"}</ChromePill>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Instructions modal
// ---------------------------------------------------------------------------

const RULES = [
  "Mục tiêu: ăn thật nhiều sỏi và quân quan (mỗi quan quân được 10 điểm). Mỗi đội có 5 ô dân ở hàng gần mình, đầu ván mỗi ô có 5 sỏi.",
  "Đến lượt, chọn một ô có sỏi của đội mình (ô đang sáng lên).",
  "Trả lời đúng phép tính để được rải quân. Sai hoặc hết giờ thì nhường lượt, không mất sỏi.",
  "Chọn hướng rải (trái hoặc phải). Sỏi được rải mỗi ô một viên, đi vòng qua cả ô quan.",
  "Ăn quân: rải xong, nếu ô kế tiếp đang trống và ô sau đó có quân thì ăn hết. Độ khó Nâng cao: ô kế tiếp còn sỏi thì bốc lên rải tiếp, và được ăn liên tiếp.",
  "Hết sỏi ở hàng của mình thì dùng 5 điểm đã ăn rải lại mỗi ô 1 viên (không đủ 5 quân thì nhận 5 quân từ kho hỗ trợ, cuối ván trừ 10 điểm).",
  "Kết thúc khi hai bên quan đều bị ăn hết hoặc hết lượt. Sỏi còn ở hàng của mình thì tính cho đội đó. Đội nhiều điểm hơn là đội thắng!",
];

function InstructionsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-ink)/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-pop-in max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-[0_24px_48px_-16px_rgba(46,42,33,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between rounded-t-[2rem] bg-gradient-to-r from-(--color-sun) to-(--color-sun-dark) px-6 py-4">
          <h2 className="font-display text-xl font-extrabold text-white">📖 CÁCH CHƠI</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex size-11 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-(--color-ink)/70">
            Ô Ăn Quan là trò chơi dân gian của hai đội. Trả lời đúng phép tính để được rải quân, ăn
            thật nhiều sỏi và quân quan nhé!
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {RULES.map((rule, i) => (
              <div
                key={i}
                className="flex gap-2 rounded-2xl border-2 border-dashed border-(--color-mint)/40 bg-(--color-mint-light)/50 p-3 text-sm text-(--color-ink)/85"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--color-mint-dark) text-xs font-extrabold text-white">
                  {i + 1}
                </span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 min-h-12 w-full rounded-full bg-(--color-sun-dark) py-3 text-base font-bold text-white shadow-[0_4px_0_#92400e] transition hover:brightness-105 active:translate-y-0.5 active:shadow-none"
          >
            ĐÃ HIỂU
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Intro screen
// ---------------------------------------------------------------------------

function TitleBanner() {
  return (
    <div className="relative mt-2 flex flex-col items-center">
      <div className="h-2 w-40 rounded-full bg-[#c88a4a] shadow-sm sm:w-56" />
      <div className="flex w-full max-w-56 justify-between px-6">
        <span className="h-5 w-0.5 bg-(--color-ink)/25" />
        <span className="h-5 w-0.5 bg-(--color-ink)/25" />
      </div>
      <div
        className="animate-banner-sway relative -mt-0.5 rounded-2xl bg-gradient-to-b from-[#c88a4a] to-[#8a5a28] px-10 py-4 shadow-[0_12px_28px_-10px_rgba(46,42,33,0.5)] sm:px-16 sm:py-5"
        style={{ transformOrigin: "top center" }}
      >
        <h1
          className="font-display select-none text-4xl font-extrabold tracking-wide text-(--color-sun) sm:text-6xl"
          style={{ textShadow: "0 2px 0 #6b3f14, 0 4px 0 #6b3f14, 0 8px 16px rgba(46,42,33,0.45)" }}
        >
          Ô ĂN QUAN
        </h1>
        <span className="absolute -bottom-3 left-2 h-0 w-0 border-x-[14px] border-t-[14px] border-x-transparent border-t-[#6b3f14]" />
        <span className="absolute -bottom-3 right-2 h-0 w-0 border-x-[14px] border-t-[14px] border-x-transparent border-t-[#6b3f14]" />
      </div>
    </div>
  );
}

function SignpostTag() {
  return (
    <div
      className="relative mt-5 inline-flex items-center gap-1 rounded-lg bg-[#fde8c9] px-3 py-1.5 text-xs font-bold text-(--color-ink) shadow-[0_3px_8px_-2px_rgba(46,42,33,0.35)]"
      style={{ transform: "rotate(-3deg)" }}
    >
      <span aria-hidden="true" className="absolute -top-2 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-(--color-ink)/30" />
      Học Toán qua trò chơi dân gian <span className="text-(--color-sun-dark)">♥</span>
    </div>
  );
}

function IntroScreen({ onStart, onInstructions }: { onStart: () => void; onInstructions: () => void }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem]">
      <VillageScene variant="rich" />
      <div className="relative z-10 flex flex-col items-center px-6 py-10 text-center sm:py-14">
        <span className="animate-pop-in rounded-full bg-white px-4 py-1.5 text-sm font-bold text-(--color-sun-dark) shadow-[0_4px_12px_-2px_rgba(46,42,33,0.25)]">
          🎉 Học Toán qua trò chơi dân gian
        </span>

        <TitleBanner />
        <SignpostTag />

        <p className="relative mt-5 max-w-md text-base text-(--color-ink)/75">
          Hai đội thi tài rải sỏi, ăn quân và so tài phép tính — trò chơi dân gian quen thuộc, không
          cần đăng nhập.
        </p>

        <div className="relative mt-8 flex h-24 w-full max-w-xs items-end justify-center">
          <div className="absolute bottom-0 h-8 w-44 rounded-[50%] bg-[#8a5a28]/15 blur-[2px]" />
          <div className="relative flex gap-2 text-5xl sm:text-6xl">
            <span className="animate-float" style={{ animationDelay: "0s" }}>
              🧒
            </span>
            <span className="animate-float" style={{ animationDelay: "0.3s" }}>
              👧
            </span>
            <span className="animate-float text-4xl sm:text-5xl" style={{ animationDelay: "0.15s" }}>
              🟤
            </span>
            <span className="animate-float" style={{ animationDelay: "0.6s" }}>
              👦
            </span>
            <span className="animate-float" style={{ animationDelay: "0.9s" }}>
              🧑‍🎓
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="animate-glow group relative mt-8 overflow-hidden rounded-full bg-(--color-sun-dark) px-12 py-4 text-xl font-extrabold text-white shadow-[0_6px_0_#92400e,0_14px_28px_-8px_rgba(217,119,6,0.55)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_#92400e]"
          style={{ transitionTimingFunction: "var(--ease-bounce)" }}
        >
          <span aria-hidden="true" className="animate-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30" />
          BẮT ĐẦU
        </button>

        <button
          type="button"
          onClick={onInstructions}
          className="relative mt-4 inline-flex min-h-11 items-center px-2 text-sm font-bold text-(--color-ink)/60 underline-offset-4 hover:text-(--color-sun-dark) hover:underline"
        >
          Xem cách chơi trước
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Setup screen
// ---------------------------------------------------------------------------

function Pill<T extends string | number>({
  value,
  current,
  label,
  onClick,
}: {
  value: T;
  current: T;
  label: string;
  onClick: (v: T) => void;
}) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`min-h-11 rounded-full px-4 py-2 text-sm font-bold transition active:translate-y-0.5 ${
        active
          ? "bg-(--color-mint) text-white shadow-[0_3px_0_var(--color-mint-dark),0_8px_16px_-4px_rgba(34,197,94,0.5)]"
          : "border-2 border-(--color-ink)/15 bg-white text-(--color-ink)/70 hover:bg-(--color-mint-light)"
      }`}
    >
      {label}
    </button>
  );
}

function SettingRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <span className="text-sm font-bold text-(--color-ink)/80">
        {icon} {label}
      </span>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SetupScreen({
  settings,
  onChange,
  onBack,
  onStart,
}: {
  settings: GameSettings;
  onChange: (s: GameSettings) => void;
  onBack: () => void;
  onStart: () => void;
}) {
  function set<K extends keyof GameSettings>(key: K, value: GameSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <div className="relative mt-4 overflow-hidden rounded-[1.75rem] px-2 py-8 sm:rounded-[2.25rem] sm:py-12">
      <VillageScene variant="flat" />
      <div className="animate-pop-in relative z-10 mx-auto max-w-2xl rounded-[2rem] border-4 border-[#c88a4a]/50 bg-white/95 p-6 shadow-[0_16px_40px_-16px_rgba(46,42,33,0.35)] sm:p-8">
        <h2 className="font-display text-center text-2xl font-extrabold text-(--color-sun-dark) sm:text-3xl">
          🧮 CHUẨN BỊ THI ĐẤU
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-(--color-mint-dark)">Đội 1 (hàng dưới)</span>
            <input
              value={settings.teamAName}
              onChange={(e) => set("teamAName", e.target.value.toUpperCase().slice(0, 16))}
              className="min-h-11 rounded-full border-2 border-(--color-mint)/40 bg-white px-4 py-2 font-bold text-(--color-ink) outline-none transition focus:border-(--color-mint-dark) focus:shadow-[0_0_0_4px_rgba(21,128,61,0.25)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-(--color-lavender)">Đội 2 (hàng trên)</span>
            <input
              value={settings.teamBName}
              onChange={(e) => set("teamBName", e.target.value.toUpperCase().slice(0, 16))}
              className="min-h-11 rounded-full border-2 border-(--color-lavender)/40 bg-white px-4 py-2 font-bold text-(--color-ink) outline-none transition focus:border-(--color-lavender) focus:shadow-[0_0_0_4px_rgba(139,92,246,0.25)]"
            />
          </label>
        </div>

        <SettingRow icon="➗" label="Phép tính">
          {(["all", "+", "-", "×", "÷"] as MathOperationFilter[]).map((op) => (
            <Pill
              key={op}
              value={op}
              current={settings.operation}
              label={{ all: "Tất cả", "+": "Cộng", "-": "Trừ", "×": "Nhân", "÷": "Chia" }[op]}
              onClick={(v) => set("operation", v)}
            />
          ))}
        </SettingRow>

        <SettingRow icon="🔢" label="Bảng">
          {(["all", 2, 3, 4, 5, 6, 7, 8, 9] as TableFilter[]).map((t) => (
            <Pill key={t} value={t} current={settings.table} label={t === "all" ? "Tất cả" : String(t)} onClick={(v) => set("table", v)} />
          ))}
        </SettingRow>

        <SettingRow icon="📏" label="Phạm vi">
          {([10, 20, 50, 100] as RangeFilter[]).map((r) => (
            <Pill key={r} value={r} current={settings.range} label={`1–${r}`} onClick={(v) => set("range", v)} />
          ))}
        </SettingRow>

        <SettingRow icon="🎯" label="Độ khó">
          {(["easy", "advanced"] as DifficultyFilter[]).map((d) => (
            <Pill key={d} value={d} current={settings.difficulty} label={d === "easy" ? "Dễ" : "Nâng cao"} onClick={(v) => set("difficulty", v)} />
          ))}
        </SettingRow>

        <SettingRow icon="🔁" label="Số lượt mỗi đội">
          {([10, 15, 20, "free"] as (number | "free")[]).map((v) => (
            <Pill key={v} value={v} current={settings.turnsPerTeam} label={v === "free" ? "Tự do" : String(v)} onClick={(val) => set("turnsPerTeam", val)} />
          ))}
        </SettingRow>

        <SettingRow icon="⏱️" label="Thời gian trả lời">
          {([10, 15, 20, 30, "unlimited"] as (number | "unlimited")[]).map((v) => (
            <Pill
              key={v}
              value={v}
              current={settings.answerSeconds}
              label={v === "unlimited" ? "Không giới hạn" : `${v} giây`}
              onClick={(val) => set("answerSeconds", val)}
            />
          ))}
        </SettingRow>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-12 flex-1 rounded-full border-2 border-(--color-ink)/15 py-3 text-base font-bold text-(--color-ink) transition hover:bg-(--color-cloud)"
          >
            QUAY LẠI
          </button>
          <button
            type="button"
            onClick={onStart}
            className="min-h-12 flex-[2] rounded-full bg-(--color-mint) py-3 text-base font-extrabold text-white shadow-[0_8px_20px_-6px_rgba(34,197,94,0.5)] transition hover:brightness-95"
          >
            BẮT ĐẦU THI ĐẤU
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Play screen
// ---------------------------------------------------------------------------

function InfoChip({ supportStock }: { supportStock: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-(--color-ink)/70 shadow-sm">
      <span aria-hidden="true">🎁</span> Kho hỗ trợ: {supportStock}
    </div>
  );
}

function PlayScreen({
  ring,
  teamA,
  teamB,
  activeTeam,
  turnPhase,
  selectedCell,
  highlightIndex,
  question,
  secondsLeft,
  answerSeconds,
  turnsPerTeam,
  supportStock,
  toast,
  feedbackReason,
  onCellClick,
  onAnswer,
  onDirection,
}: {
  ring: number[];
  teamA: TeamState;
  teamB: TeamState;
  activeTeam: Team;
  turnPhase: TurnPhase;
  selectedCell: number | null;
  highlightIndex: number | null;
  question: MathQuestion | null;
  secondsLeft: number | null;
  answerSeconds: number | "unlimited";
  turnsPerTeam: number | "free";
  supportStock: number;
  toast: string | null;
  feedbackReason: "wrong" | "timeout" | null;
  onCellClick: (i: number) => void;
  onAnswer: (choice: number) => void;
  onDirection: (dir: 1 | -1) => void;
}) {
  const activeState = activeTeam === "A" ? teamA : teamB;

  return (
    <div className="relative mt-2 overflow-hidden rounded-[1.75rem] px-3 py-5 sm:rounded-[2.25rem] sm:px-5 sm:py-6">
      <VillageScene variant="flat" />
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <InfoChip supportStock={supportStock} />
          <TurnBanner activeTeam={activeTeam} activeName={activeState.name} />
          <TeamCard team={teamB} teamId="B" active={activeTeam === "B"} turnsPerTeam={turnsPerTeam} />
        </div>

        <Board
          ring={ring}
          activeTeam={activeTeam}
          selectable={turnPhase === "choose-cell"}
          selectedCell={selectedCell}
          highlightIndex={highlightIndex}
          onCellClick={onCellClick}
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <TeamCard team={teamA} teamId="A" active={activeTeam === "A"} turnsPerTeam={turnsPerTeam} />

          <div className="flex-1 text-center">
            {turnPhase === "choose-cell" && (
              <p className="animate-pop-in font-display text-base font-bold text-(--color-ink) sm:text-lg">
                👉 {activeState.name} chọn một ô có sỏi nhé!
              </p>
            )}

            {toast && <p className="animate-pop-in mt-1 text-sm font-bold text-(--color-sun-dark)">{toast}</p>}

            {turnPhase === "feedback-wrong" && (
              <p className="animate-wiggle font-display text-base font-bold text-(--color-ink) sm:text-lg">
                {feedbackReason === "timeout" ? "⏰ Hết giờ! Nhường lượt cho đội kia." : "❌ Sai rồi! Nhường lượt cho đội kia."}
              </p>
            )}
          </div>
        </div>

        {turnPhase === "direction" && (
          <div className="animate-pop-in mt-5 flex flex-col items-center gap-3">
            <p className="font-display font-bold text-(--color-mint-dark)">✅ Trả lời đúng! Chọn hướng rải nhé</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onDirection(-1)}
                className="min-h-12 rounded-full bg-gradient-to-b from-[#5a4536] to-(--color-ink) px-8 py-3 text-lg font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,0.25),0_10px_20px_-6px_rgba(46,42,33,0.5)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.25)]"
              >
                ⬅️ Trái
              </button>
              <button
                type="button"
                onClick={() => onDirection(1)}
                className="min-h-12 rounded-full bg-gradient-to-b from-[#5a4536] to-(--color-ink) px-8 py-3 text-lg font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,0.25),0_10px_20px_-6px_rgba(46,42,33,0.5)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.25)]"
              >
                Phải ➡️
              </button>
            </div>
          </div>
        )}

        {turnPhase === "question" && question && (
          <QuestionModal question={question} activeTeam={activeTeam} secondsLeft={secondsLeft} answerSeconds={answerSeconds} onAnswer={onAnswer} />
        )}
      </div>
    </div>
  );
}

function TurnBanner({ activeTeam, activeName }: { activeTeam: Team; activeName: string }) {
  const tint = TEAM_TINT[activeTeam];
  return (
    <div
      className={`animate-pop-in relative rounded-full bg-gradient-to-r ${tint.gradient} px-6 py-2.5 text-center font-display text-sm font-extrabold text-white shadow-[0_6px_16px_-4px_rgba(46,42,33,0.4)] sm:text-base`}
    >
      ĐẾN LƯỢT {activeName}!
    </div>
  );
}

function TeamCard({
  team,
  teamId,
  active,
  turnsPerTeam,
}: {
  team: TeamState;
  teamId: Team;
  active: boolean;
  turnsPerTeam: number | "free";
}) {
  const tint = TEAM_TINT[teamId];
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl bg-white p-1.5 pr-4 shadow-[0_4px_12px_-4px_rgba(46,42,33,0.2)] transition ${
        active ? `ring-[3px] ${tint.ring} animate-glow` : ""
      }`}
    >
      <IconChip icon={teamId === "A" ? "🧒" : "👧"} tint={tint.chip} size="md" />
      <div>
        <span className={`block text-xs font-extrabold uppercase ${tint.text}`}>{team.name}</span>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-(--color-ink)/60">
          <span>⭐ {team.points}</span>
          <span>🏆 {team.quanCaptured}</span>
          <span>🧺 {team.basket}</span>
          {turnsPerTeam !== "free" && <span>🔁 {team.turnsUsed}/{turnsPerTeam}</span>}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Board
// ---------------------------------------------------------------------------

function StoneCluster({ cellIndex, count }: { cellIndex: number; count: number }) {
  if (count <= 0) return null;
  return (
    <div className="pointer-events-none relative h-8 w-full sm:h-10" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const [x, y] = STONE_OFFSETS[i % STONE_OFFSETS.length];
        const size = 7 + ((cellIndex + i) % 3) * 2;
        return (
          <span
            key={i}
            className="animate-pop-in absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              backgroundColor: stoneColor(cellIndex, i),
              boxShadow: "inset -1px -1px 2px rgba(0,0,0,0.3), inset 1px 1px 1px rgba(255,255,255,0.7), 0 1px 1px rgba(46,42,33,0.3)",
            }}
          />
        );
      })}
    </div>
  );
}

function Board({
  ring,
  activeTeam,
  selectable,
  selectedCell,
  highlightIndex,
  onCellClick,
}: {
  ring: number[];
  activeTeam: Team;
  selectable: boolean;
  selectedCell: number | null;
  highlightIndex: number | null;
  onCellClick: (i: number) => void;
}) {
  return (
    <div className="relative mt-4 overflow-x-auto">
      <div className="relative flex min-w-[560px] items-stretch gap-2 rounded-[2.5rem] border-4 border-[#8a5a28]/50 bg-gradient-to-br from-[#d9a362] to-[#9c6a34] p-3 shadow-[inset_0_2px_10px_rgba(255,255,255,0.25),inset_0_-6px_16px_rgba(46,42,33,0.3),0_14px_30px_-14px_rgba(46,42,33,0.45)] sm:gap-3 sm:p-4">
        <div className="pointer-events-none absolute inset-3 rounded-[2rem] bg-wood-grain opacity-60 sm:inset-4" />

        <QuanCell index={QUAN_L} ring={ring} highlightIndex={highlightIndex} />

        <div className="relative z-10 grid flex-1 grid-rows-2 gap-2 sm:gap-3">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {DISPLAY_ORDER.B.map((idx, i) => (
              <Cell
                key={idx}
                index={idx}
                label={i + 1}
                count={ring[idx]}
                owner="B"
                clickable={selectable && activeTeam === "B" && ring[idx] > 0}
                selected={selectedCell === idx}
                highlighted={highlightIndex === idx}
                onClick={onCellClick}
              />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {DISPLAY_ORDER.A.map((idx, i) => (
              <Cell
                key={idx}
                index={idx}
                label={i + 1}
                count={ring[idx]}
                owner="A"
                clickable={selectable && activeTeam === "A" && ring[idx] > 0}
                selected={selectedCell === idx}
                highlighted={highlightIndex === idx}
                onClick={onCellClick}
              />
            ))}
          </div>
        </div>

        <QuanCell index={QUAN_R} ring={ring} highlightIndex={highlightIndex} />
      </div>
    </div>
  );
}

function QuanCell({ index, ring, highlightIndex }: { index: number; ring: number[]; highlightIndex: number | null }) {
  const count = ring[index];
  const closed = count === -1;
  const glow = highlightIndex === index;
  return (
    <div
      className={`relative z-10 flex w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1.5 rounded-[2.5rem] border-[3px] border-[#6b4017]/50 bg-gradient-to-b from-[#f4dfb8] to-[#e4c489] py-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_4px_10px_rgba(46,42,33,0.25)] sm:w-24 ${
        closed ? "opacity-70" : ""
      } ${glow ? "ring-4 ring-(--color-sun)/60" : ""}`}
    >
      <span className="text-[9px] font-extrabold uppercase tracking-wide text-(--color-ink)/50">Quan</span>
      {closed ? (
        <span className="animate-pop-in text-3xl">🏆</span>
      ) : (
        <>
          <div className="relative flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-(--color-sun) to-(--color-sun-dark) text-xs font-extrabold text-white shadow-[inset_0_-2px_3px_rgba(0,0,0,0.25),inset_0_2px_2px_rgba(255,255,255,0.5)] sm:size-10">
            10
          </div>
          <span className="text-xs font-bold text-(--color-ink)/60">{count}</span>
        </>
      )}
    </div>
  );
}

function Cell({
  index,
  label,
  count,
  owner,
  clickable,
  selected,
  highlighted,
  onClick,
}: {
  index: number;
  label: number;
  count: number;
  owner: Team;
  clickable: boolean;
  selected: boolean;
  highlighted: boolean;
  onClick?: (i: number) => void;
}) {
  const tint = TEAM_TINT[owner];
  const displayCount = Math.min(count, 14);
  const overflow = count - 14;

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => onClick?.(index)}
      className={`relative flex min-h-16 flex-col items-center justify-center rounded-2xl border-2 bg-gradient-to-b from-[#fff6e6] to-[#fbe7c4] p-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_4px_rgba(46,42,33,0.12)] transition sm:min-h-24 ${
        selected
          ? `scale-105 border-(--color-sun-dark) ${tint.bgLight} shadow-[0_0_0_4px_rgba(217,119,6,0.25)]`
          : highlighted
            ? `border-(--color-sun) ${tint.bgLight}`
            : "border-[#8a5a28]/25"
      } ${clickable ? "animate-glow cursor-pointer hover:-translate-y-0.5" : "cursor-default opacity-95"}`}
    >
      <span className={`absolute -top-2 -left-2 flex size-5 items-center justify-center rounded-full text-[10px] font-extrabold text-white shadow-sm ${tint.bg}`}>
        {label}
      </span>
      <StoneCluster cellIndex={index} count={displayCount} />
      {overflow > 0 && (
        <span className="absolute -bottom-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-(--color-sun-dark) text-[9px] font-extrabold text-white shadow-sm">
          +{overflow}
        </span>
      )}
      <span className="mt-1 text-[10px] font-bold text-(--color-ink)/50">{count}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Question modal
// ---------------------------------------------------------------------------

function QuestionModal({
  question,
  activeTeam,
  secondsLeft,
  answerSeconds,
  onAnswer,
}: {
  question: MathQuestion;
  activeTeam: Team;
  secondsLeft: number | null;
  answerSeconds: number | "unlimited";
  onAnswer: (choice: number) => void;
}) {
  const tint = TEAM_TINT[activeTeam];
  const progress = answerSeconds !== "unlimited" && secondsLeft !== null ? secondsLeft / answerSeconds : 1;
  const ringColorVar = activeTeam === "A" ? "var(--color-mint-dark)" : "var(--color-lavender)";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-(--color-ink)/55 p-4 backdrop-blur-sm">
      <div className="animate-pop-in w-full max-w-sm rounded-[2rem] bg-white p-6 pt-10 text-center shadow-[0_24px_48px_-16px_rgba(46,42,33,0.5)]">
        <IconChip
          icon={activeTeam === "A" ? "🧒" : "👧"}
          tint={tint.chip}
          size="md"
          className="mx-auto -mt-16 mb-3 shadow-[0_6px_14px_-4px_rgba(46,42,33,0.35)]"
        />
        {answerSeconds !== "unlimited" && (
          <div
            className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full font-extrabold text-(--color-ink)"
            style={{ background: `conic-gradient(${ringColorVar} ${progress * 360}deg, var(--color-cloud) 0deg)` }}
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-white text-sm">{secondsLeft}</span>
          </div>
        )}
        <p className={`text-sm font-bold ${tint.text}`}>Trả lời đúng để được rải quân!</p>
        <p className="font-display mt-2 text-4xl font-extrabold text-(--color-ink)">{question.prompt}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {question.choices.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onAnswer(c)}
              className="min-h-14 rounded-2xl bg-(--color-cloud) py-4 text-xl font-extrabold text-(--color-ink) shadow-[0_3px_0_rgba(46,42,33,0.08),0_6px_14px_-4px_rgba(46,42,33,0.18)] transition hover:-translate-y-0.5 hover:bg-(--color-mint-light) active:translate-y-0.5"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Finished screen
// ---------------------------------------------------------------------------

function FinishedScreen({
  teamA,
  teamB,
  winner,
  onRestart,
}: {
  teamA: TeamState;
  teamB: TeamState;
  winner: "A" | "B" | "draw" | null;
  onRestart: () => void;
}) {
  const winnerTeam = winner === "A" ? teamA : winner === "B" ? teamB : null;

  return (
    <div className="animate-pop-in relative mt-4 overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-(--color-sun)/20 to-white px-6 py-14 text-center sm:rounded-[2.25rem]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="animate-twinkle absolute left-[12%] top-8 text-3xl">🎊</span>
        <span className="animate-twinkle absolute right-[14%] top-12 text-3xl" style={{ animationDelay: "0.3s" }}>
          🎉
        </span>
        <span className="animate-twinkle absolute left-[20%] bottom-10 text-3xl" style={{ animationDelay: "0.6s" }}>
          ✨
        </span>
        <span className="animate-twinkle absolute right-[20%] bottom-14 text-3xl" style={{ animationDelay: "0.9s" }}>
          🎊
        </span>
      </div>

      <span className="animate-float relative inline-block text-7xl">{winner === "draw" ? "🤝" : "🏆"}</span>
      <h2 className="font-display relative mt-4 text-3xl font-extrabold text-(--color-ink) sm:text-4xl">
        {winner === "draw" ? "HÒA RỒI!" : `${winnerTeam?.name} CHIẾN THẮNG!`}
      </h2>

      <div className="relative mx-auto mt-8 flex max-w-sm flex-col gap-3">
        <ScoreRow team={teamA} teamId="A" highlight={winner === "A"} />
        <ScoreRow team={teamB} teamId="B" highlight={winner === "B"} />
      </div>

      <div className="relative mt-10 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="min-h-12 rounded-full bg-(--color-sun-dark) px-8 py-3 text-base font-extrabold text-white shadow-[0_5px_0_#92400e,0_12px_24px_-8px_rgba(217,119,6,0.5)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#92400e]"
        >
          🔁 Chơi lại
        </button>
        <Link
          href="/mini-game"
          className="flex min-h-12 items-center rounded-full border-2 border-(--color-ink)/15 px-8 py-3 text-base font-bold text-(--color-ink) transition hover:bg-(--color-cloud)"
        >
          Về Mini game
        </Link>
      </div>
    </div>
  );
}

function ScoreRow({ team, teamId, highlight }: { team: TeamState; teamId: Team; highlight: boolean }) {
  const tint = TEAM_TINT[teamId];
  return (
    <div className={`flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-[0_3px_10px_-3px_rgba(46,42,33,0.18)] ${highlight ? `ring-[3px] ${tint.ring}` : ""}`}>
      <span className={`flex items-center gap-2 font-display font-bold ${tint.text}`}>
        {highlight && <span aria-hidden="true">🥇</span>}
        {team.name}
      </span>
      <span className="font-extrabold text-(--color-ink)">
        {team.points} điểm{team.borrowed ? " (đã mượn kho hỗ trợ, -10)" : ""}
      </span>
    </div>
  );
}
