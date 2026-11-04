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

const TEAM_TINT: Record<Team, { text: string; bg: string; bgLight: string; ring: string }> = {
  A: { text: "text-(--color-sky)", bg: "bg-(--color-sky)", bgLight: "bg-(--color-sky-light)", ring: "ring-(--color-sky)" },
  B: { text: "text-(--color-lavender)", bg: "bg-(--color-lavender)", bgLight: "bg-violet-100", ring: "ring-(--color-lavender)" },
};

const STONE_PALETTE = ["--color-honey", "--color-mint", "--color-sky", "--color-lavender", "--color-peach", "--color-honey-dark"];

function stoneColor(cellIndex: number, i: number) {
  return `var(${STONE_PALETTE[(cellIndex * 3 + i * 5) % STONE_PALETTE.length]})`;
}

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

  return (
    <div
      ref={wrapperRef}
      className="min-h-[70vh] rounded-3xl bg-gradient-to-b from-(--color-mint-light) to-(--color-honey-light) p-4 shadow-[0_8px_32px_-12px_rgba(62,40,27,0.2)] md:p-6"
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
// Top bar
// ---------------------------------------------------------------------------

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
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/mini-game"
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-(--color-cocoa) shadow-sm transition hover:-translate-y-0.5"
        >
          ← Về Mini game
        </Link>
        <button
          type="button"
          onClick={onFullscreen}
          className="flex size-9 items-center justify-center rounded-full bg-white text-(--color-cocoa) shadow-sm transition hover:-translate-y-0.5"
          aria-label="Toàn màn hình"
        >
          {isFullscreen ? "⤢" : "⛶"}
        </button>
        <button
          type="button"
          onClick={onInstructions}
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-(--color-cocoa) shadow-sm transition hover:-translate-y-0.5"
        >
          📖 Hướng dẫn chi tiết
        </button>
      </div>
      <button
        type="button"
        onClick={onToggleSound}
        className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-(--color-cocoa) shadow-sm transition hover:-translate-y-0.5"
      >
        {soundOn ? "🔊 ÂM THANH: BẬT" : "🔇 ÂM THANH: TẮT"}
      </button>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-cocoa)/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-pop-in max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-(--color-cocoa)">CÁCH CHƠI</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-(--color-cream) text-(--color-cocoa) hover:bg-(--color-honey-light)"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm text-(--color-cocoa)/70">
          Ô Ăn Quan là trò chơi dân gian của hai đội. Trả lời đúng phép tính để được rải quân, ăn
          thật nhiều sỏi và quân quan nhé!
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {RULES.map((rule, i) => (
            <div key={i} className="rounded-2xl border border-dashed border-(--color-sky)/30 bg-(--color-sky-light)/40 p-3 text-sm text-(--color-cocoa)/85">
              <span className="font-bold text-(--color-sky)">{i + 1}. </span>
              {rule}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-(--color-honey) py-3 text-base font-bold text-white transition hover:bg-(--color-honey-dark)"
        >
          ĐÃ HIỂU
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Intro screen
// ---------------------------------------------------------------------------

function IntroScreen({ onStart, onInstructions }: { onStart: () => void; onInstructions: () => void }) {
  return (
    <div className="relative mt-4 flex flex-col items-center overflow-hidden rounded-3xl bg-gradient-to-b from-(--color-sky-light) via-(--color-mint-light) to-(--color-honey-light) px-6 py-14 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="animate-float absolute left-[8%] top-10 text-4xl" style={{ animationDelay: "0s" }}>🌾</span>
        <span className="animate-float absolute right-[10%] top-16 text-4xl" style={{ animationDelay: "0.5s" }}>🎋</span>
        <span className="animate-twinkle absolute left-[20%] bottom-10 text-3xl" style={{ animationDelay: "0.2s" }}>✨</span>
        <span className="animate-twinkle absolute right-[18%] bottom-16 text-3xl" style={{ animationDelay: "0.8s" }}>🌼</span>
      </div>

      <span className="animate-pop-in relative rounded-full bg-white px-4 py-1.5 text-sm font-bold text-(--color-honey-dark) shadow-sm">
        🎉 Học Toán qua trò chơi dân gian
      </span>

      <h1 className="font-display relative mt-6 text-5xl font-extrabold text-(--color-cocoa) drop-shadow-sm sm:text-6xl">
        Ô ĂN QUAN
      </h1>
      <p className="relative mt-3 max-w-md text-(--color-cocoa)/70">
        Hai đội thi tài rải sỏi, ăn quân và so tài phép tính — trò chơi dân gian quen thuộc, không
        cần đăng nhập.
      </p>

      <div className="relative mt-8 flex gap-3 text-6xl">
        <span className="animate-float" style={{ animationDelay: "0s" }}>🧒</span>
        <span className="animate-float" style={{ animationDelay: "0.3s" }}>👧</span>
        <span className="animate-float" style={{ animationDelay: "0.6s" }}>🟤</span>
        <span className="animate-float" style={{ animationDelay: "0.9s" }}>👦</span>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="animate-glow group relative mt-10 overflow-hidden rounded-full bg-(--color-honey) px-12 py-4 text-xl font-extrabold text-white transition hover:bg-(--color-honey-dark) active:scale-95"
        style={{ transitionTimingFunction: "var(--ease-bounce)" }}
      >
        <span aria-hidden="true" className="animate-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30" />
        BẮT ĐẦU
      </button>

      <button
        type="button"
        onClick={onInstructions}
        className="relative mt-4 text-sm font-bold text-(--color-cocoa)/60 underline-offset-4 hover:text-(--color-honey-dark) hover:underline"
      >
        Xem cách chơi trước
      </button>
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
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-(--color-mint) text-white shadow-[0_6px_14px_-4px_rgba(0,187,127,0.5)]"
          : "bg-white text-(--color-cocoa)/70 hover:bg-(--color-mint-light)"
      }`}
    >
      {label}
    </button>
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
    <div className="animate-pop-in mx-auto mt-4 max-w-2xl rounded-3xl bg-white/90 p-6 shadow-[0_8px_32px_-12px_rgba(62,40,27,0.25)] sm:p-8">
      <h2 className="font-display text-center text-2xl font-extrabold text-(--color-cocoa)">
        CHUẨN BỊ THI ĐẤU
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-(--color-sky)">Đội 1 (hàng dưới)</span>
          <input
            value={settings.teamAName}
            onChange={(e) => set("teamAName", e.target.value.toUpperCase().slice(0, 16))}
            className="rounded-full border-2 border-(--color-sky)/30 px-4 py-2 font-bold text-(--color-cocoa) focus:border-(--color-sky) focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-(--color-lavender)">Đội 2 (hàng trên)</span>
          <input
            value={settings.teamBName}
            onChange={(e) => set("teamBName", e.target.value.toUpperCase().slice(0, 16))}
            className="rounded-full border-2 border-(--color-lavender)/30 px-4 py-2 font-bold text-(--color-cocoa) focus:border-(--color-lavender) focus:outline-none"
          />
        </label>
      </div>

      <SettingRow label="Phép tính">
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

      <SettingRow label="Bảng">
        {(["all", 2, 3, 4, 5, 6, 7, 8, 9] as TableFilter[]).map((t) => (
          <Pill key={t} value={t} current={settings.table} label={t === "all" ? "Tất cả" : String(t)} onClick={(v) => set("table", v)} />
        ))}
      </SettingRow>

      <SettingRow label="Phạm vi">
        {([10, 20, 50, 100] as RangeFilter[]).map((r) => (
          <Pill key={r} value={r} current={settings.range} label={`1–${r}`} onClick={(v) => set("range", v)} />
        ))}
      </SettingRow>

      <SettingRow label="Độ khó">
        {(["easy", "advanced"] as DifficultyFilter[]).map((d) => (
          <Pill key={d} value={d} current={settings.difficulty} label={d === "easy" ? "Dễ" : "Nâng cao"} onClick={(v) => set("difficulty", v)} />
        ))}
      </SettingRow>

      <SettingRow label="Số lượt mỗi đội">
        {([10, 15, 20, "free"] as (number | "free")[]).map((v) => (
          <Pill key={v} value={v} current={settings.turnsPerTeam} label={v === "free" ? "Tự do" : String(v)} onClick={(val) => set("turnsPerTeam", val)} />
        ))}
      </SettingRow>

      <SettingRow label="Thời gian trả lời">
        {([10, 15, 20, 30, "unlimited"] as (number | "unlimited")[]).map((v) => (
          <Pill key={v} value={v} current={settings.answerSeconds} label={v === "unlimited" ? "Không giới hạn" : `${v} giây`} onClick={(val) => set("answerSeconds", val)} />
        ))}
      </SettingRow>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full border-2 border-(--color-cocoa)/15 py-3 text-base font-bold text-(--color-cocoa) transition hover:bg-(--color-cream)"
        >
          QUAY LẠI
        </button>
        <button
          type="button"
          onClick={onStart}
          className="flex-[2] rounded-full bg-(--color-mint) py-3 text-base font-extrabold text-white shadow-[0_8px_20px_-6px_rgba(0,187,127,0.5)] transition hover:brightness-95"
        >
          BẮT ĐẦU THI ĐẤU
        </button>
      </div>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <span className="text-sm font-bold text-(--color-cocoa)/80">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Play screen
// ---------------------------------------------------------------------------

function PlayScreen({
  ring,
  teamA,
  teamB,
  activeTeam,
  turnPhase,
  selectedCell,
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
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TeamCard team={teamB} teamId="B" active={activeTeam === "B"} turnsPerTeam={turnsPerTeam} />
        <TurnBanner activeTeam={activeTeam} activeName={activeState.name} />
        <TeamCard team={teamA} teamId="A" active={activeTeam === "A"} turnsPerTeam={turnsPerTeam} />
      </div>

      <p className="mt-3 text-center text-xs font-bold text-(--color-cocoa)/50">
        Kho quân hỗ trợ: {supportStock}
      </p>

      <Board
        ring={ring}
        activeTeam={activeTeam}
        selectable={turnPhase === "choose-cell"}
        selectedCell={selectedCell}
        onCellClick={onCellClick}
      />

      {turnPhase === "choose-cell" && (
        <p className="animate-pop-in mt-4 text-center font-display text-lg font-bold text-(--color-cocoa)">
          👉 Chọn một ô có sỏi nhé!
        </p>
      )}

      {toast && (
        <p className="animate-pop-in mt-3 text-center text-sm font-bold text-(--color-honey-dark)">
          {toast}
        </p>
      )}

      {turnPhase === "feedback-wrong" && (
        <p className="animate-wiggle mt-4 text-center font-display text-lg font-bold text-(--color-bloom)">
          {feedbackReason === "timeout" ? "⏰ Hết giờ! Nhường lượt cho đội kia." : "❌ Sai rồi! Nhường lượt cho đội kia."}
        </p>
      )}

      {turnPhase === "direction" && (
        <div className="animate-pop-in mt-5 flex flex-col items-center gap-3">
          <p className="font-display font-bold text-(--color-mint)">✅ Trả lời đúng! Chọn hướng rải nhé</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onDirection(-1)}
              className="rounded-full bg-(--color-cocoa) px-8 py-3 text-lg font-extrabold text-white transition hover:-translate-y-0.5"
            >
              ⬅️ Trái
            </button>
            <button
              type="button"
              onClick={() => onDirection(1)}
              className="rounded-full bg-(--color-cocoa) px-8 py-3 text-lg font-extrabold text-white transition hover:-translate-y-0.5"
            >
              Phải ➡️
            </button>
          </div>
        </div>
      )}

      {turnPhase === "question" && question && (
        <QuestionModal
          question={question}
          activeTeam={activeTeam}
          secondsLeft={secondsLeft}
          answerSeconds={answerSeconds}
          onAnswer={onAnswer}
        />
      )}
    </div>
  );
}

function TurnBanner({ activeTeam, activeName }: { activeTeam: Team; activeName: string }) {
  const tint = TEAM_TINT[activeTeam];
  return (
    <div className={`animate-pop-in rounded-full px-6 py-2.5 text-center font-display text-base font-extrabold text-white shadow-md ${tint.bg}`}>
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
      className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-sm transition ${
        active ? `ring-2 ${tint.ring}` : ""
      }`}
    >
      <span className={`flex size-10 items-center justify-center rounded-full text-xl ${tint.bgLight}`}>
        {teamId === "A" ? "🧒" : "👧"}
      </span>
      <div>
        <span className={`block text-xs font-bold uppercase ${tint.text}`}>{team.name}</span>
        <span className="block text-sm font-extrabold text-(--color-cocoa)">
          Điểm: {team.points} · Quan: {team.quanCaptured}
        </span>
        <span className="block text-[11px] text-(--color-cocoa)/50">
          Giỏ: {team.basket} sỏi
          {turnsPerTeam !== "free" && ` · Lượt: ${team.turnsUsed}/${turnsPerTeam}`}
        </span>
      </div>
    </div>
  );
}

function Board({
  ring,
  activeTeam,
  selectable,
  selectedCell,
  onCellClick,
}: {
  ring: number[];
  activeTeam: Team;
  selectable: boolean;
  selectedCell: number | null;
  onCellClick: (i: number) => void;
}) {
  return (
    <div className="mt-4 flex items-stretch gap-2 overflow-x-auto rounded-[2rem] bg-gradient-to-br from-[#c88a4a] to-[#a9692c] p-3 shadow-inner sm:gap-3 sm:p-4">
      <QuanCell index={QUAN_L} ring={ring} />
      <div className="grid min-w-[320px] flex-1 grid-rows-2 gap-2 sm:gap-3">
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
              onClick={onCellClick}
            />
          ))}
        </div>
      </div>
      <QuanCell index={QUAN_R} ring={ring} />
    </div>
  );
}

function QuanCell({ index, ring }: { index: number; ring: number[] }) {
  const count = ring[index];
  const closed = count === -1;
  return (
    <div
      className={`flex w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-[1.5rem] border-2 border-[#8a5a28]/40 bg-[#f4dfb8] py-3 shadow-inner sm:w-20 ${
        closed ? "opacity-60" : ""
      }`}
    >
      <span className="text-[10px] font-bold uppercase text-(--color-cocoa)/50">Quan</span>
      {closed ? (
        <span className="text-2xl">🏆</span>
      ) : (
        <>
          <span className="flex size-8 items-center justify-center rounded-full bg-(--color-honey) text-xs font-extrabold text-white sm:size-9">
            10
          </span>
          <span className="text-xs font-bold text-(--color-cocoa)/60">{count}</span>
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
  onClick,
}: {
  index: number;
  label: number;
  count: number;
  owner: Team;
  clickable: boolean;
  selected: boolean;
  onClick?: (i: number) => void;
}) {
  const tint = TEAM_TINT[owner];
  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => onClick?.(index)}
      className={`relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-[#fff6e6] p-2 transition sm:min-h-20 ${
        selected ? `scale-105 border-(--color-honey-dark) ${tint.bgLight}` : "border-[#8a5a28]/20"
      } ${clickable ? "animate-glow cursor-pointer hover:-translate-y-0.5" : "cursor-default opacity-90"}`}
    >
      <span className={`absolute -top-2 -left-2 flex size-5 items-center justify-center rounded-full text-[10px] font-extrabold text-white ${tint.bg}`}>
        {label}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-0.5">
        {Array.from({ length: Math.min(count, 12) }).map((_, i) => (
          <span
            key={i}
            className="size-2 rounded-full sm:size-2.5"
            style={{ backgroundColor: stoneColor(index, i) }}
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-(--color-cocoa)/50">{count}</span>
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
  const progress =
    answerSeconds !== "unlimited" && secondsLeft !== null ? secondsLeft / answerSeconds : 1;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-(--color-cocoa)/50 p-4 backdrop-blur-sm">
      <div className="animate-pop-in w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
        {answerSeconds !== "unlimited" && (
          <div
            className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full font-extrabold text-(--color-cocoa)"
            style={{
              background: `conic-gradient(var(--color-honey) ${progress * 360}deg, var(--color-honey-light) 0deg)`,
            }}
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-white text-sm">
              {secondsLeft}
            </span>
          </div>
        )}
        <p className={`text-sm font-bold ${tint.text}`}>Trả lời đúng để được rải quân!</p>
        <p className="font-display mt-2 text-4xl font-extrabold text-(--color-cocoa)">{question.prompt}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {question.choices.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onAnswer(c)}
              className="rounded-2xl bg-(--color-cream) py-4 text-xl font-extrabold text-(--color-cocoa) transition hover:-translate-y-0.5 hover:bg-(--color-honey-light)"
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
    <div className="animate-pop-in relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-b from-(--color-honey-light) to-white px-6 py-14 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="animate-twinkle absolute left-[12%] top-8 text-3xl">🎊</span>
        <span className="animate-twinkle absolute right-[14%] top-12 text-3xl" style={{ animationDelay: "0.3s" }}>🎉</span>
        <span className="animate-twinkle absolute left-[20%] bottom-10 text-3xl" style={{ animationDelay: "0.6s" }}>✨</span>
        <span className="animate-twinkle absolute right-[20%] bottom-14 text-3xl" style={{ animationDelay: "0.9s" }}>🎊</span>
      </div>

      <span className="relative text-6xl">{winner === "draw" ? "🤝" : "🏆"}</span>
      <h2 className="font-display relative mt-4 text-3xl font-extrabold text-(--color-cocoa)">
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
          className="rounded-full bg-(--color-honey) px-8 py-3 text-base font-extrabold text-white transition hover:bg-(--color-honey-dark)"
        >
          🔁 Chơi lại
        </button>
        <Link
          href="/mini-game"
          className="rounded-full border-2 border-(--color-cocoa)/15 px-8 py-3 text-base font-bold text-(--color-cocoa) transition hover:bg-(--color-cream)"
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
    <div className={`flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-sm ${highlight ? `ring-2 ${tint.ring}` : ""}`}>
      <span className={`font-display font-bold ${tint.text}`}>{team.name}</span>
      <span className="font-extrabold text-(--color-cocoa)">
        {team.points} điểm{team.borrowed ? " (đã mượn kho hỗ trợ, -10)" : ""}
      </span>
    </div>
  );
}
