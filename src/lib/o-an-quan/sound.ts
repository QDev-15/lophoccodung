let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, startOffset: number, duration: number, type: OscillatorType = "sine", gainValue = 0.08) {
  const audio = getContext();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(audio.destination);
  const start = audio.currentTime + startOffset;
  gain.gain.setValueAtTime(gainValue, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.start(start);
  osc.stop(start + duration);
}

export function playCorrect() {
  tone(523.25, 0, 0.12);
  tone(659.25, 0.1, 0.16);
}

export function playWrong() {
  tone(196, 0, 0.25, "sawtooth", 0.06);
}

export function playCapture() {
  tone(880, 0, 0.08, "triangle", 0.1);
  tone(1174.66, 0.07, 0.12, "triangle", 0.1);
}

export function playSeed() {
  tone(740, 0, 0.04, "square", 0.025);
}

export function playWin() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.12, 0.2, "triangle", 0.09));
}
