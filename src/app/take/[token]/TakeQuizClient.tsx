"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type PublicQuestion = {
  id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
  prompt: string;
  points: number;
  data: {
    options?: { id: string; text: string }[];
  };
};

type AssignmentInfo = {
  assignment: {
    id: string;
    className: string;
    timeLimitSeconds: number | null;
    allowMultipleSubmissions: boolean;
  };
  quiz: { title: string; description: string | null };
  questions: PublicQuestion[];
};

type Phase = "loading" | "name-entry" | "in-progress" | "submitted" | "error";

export function TakeQuizClient({ token }: { token: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [info, setInfo] = useState<AssignmentInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [result, setResult] = useState<{ score: number; maxScore: number; showResults: boolean } | null>(
    null,
  );
  const submittingRef = useRef(false);

  useEffect(() => {
    fetch(`/api/public/assignments/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Không tìm thấy bài tập");
        }
        return res.json();
      })
      .then((data: AssignmentInfo) => {
        setInfo(data);
        setPhase("name-entry");
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setPhase("error");
      });
  }, [token]);

  async function handleStart() {
    if (!studentName.trim()) return;
    const res = await fetch(`/api/public/assignments/${token}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentDisplayName: studentName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMessage(data.error ?? "Có lỗi xảy ra");
      return;
    }
    setSubmissionId(data.submissionId);
    setSecondsLeft(info?.assignment.timeLimitSeconds ?? null);
    setPhase("in-progress");
  }

  const handleSubmit = useCallback(async () => {
    if (submittingRef.current || !submissionId) return;
    submittingRef.current = true;
    const res = await fetch(`/api/public/assignments/${token}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId, answers }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMessage(data.error ?? "Có lỗi xảy ra");
      submittingRef.current = false;
      return;
    }
    setResult(data);
    setPhase("submitted");
  }, [token, submissionId, answers]);

  useEffect(() => {
    if (phase !== "in-progress" || secondsLeft === null || secondsLeft > 0) return;
    // Time is up: auto-submit. Intentional setState-on-effect for the timeout path.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleSubmit();
  }, [phase, secondsLeft, handleSubmit]);

  useEffect(() => {
    if (phase !== "in-progress" || secondsLeft === null || secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => (s ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, secondsLeft]);

  if (phase === "loading") {
    return <p className="text-center text-zinc-500">Đang tải...</p>;
  }

  if (phase === "error") {
    return <p className="text-center text-red-600">{errorMessage}</p>;
  }

  if (phase === "name-entry" && info) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">{info.quiz.title}</h1>
        <p className="text-sm text-zinc-500">Lớp {info.assignment.className}</p>
        {info.assignment.timeLimitSeconds && (
          <p className="text-sm text-zinc-500">
            Thời gian làm bài: {Math.round(info.assignment.timeLimitSeconds / 60)} phút
          </p>
        )}
        <input
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Nhập họ tên của bạn"
          className="w-64 rounded-lg border border-zinc-300 px-3 py-2 text-center text-sm focus:border-sky-500 focus:outline-none"
        />
        <button
          onClick={handleStart}
          disabled={!studentName.trim()}
          className="rounded-full bg-sky-600 px-8 py-3 text-base font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          Bắt đầu làm bài
        </button>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>
    );
  }

  if (phase === "in-progress" && info) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900">{info.quiz.title}</h1>
          {secondsLeft !== null && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </span>
          )}
        </div>

        {info.questions.map((q, index) => (
          <div key={q.id} className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="font-medium text-zinc-900">
              Câu {index + 1}. {q.prompt}
            </p>
            <div className="mt-3">
              {q.type === "MULTIPLE_CHOICE" && (
                <div className="flex flex-col gap-2">
                  {q.data.options?.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={q.id}
                        checked={
                          (answers[q.id] as { selectedOptionId?: string })?.selectedOptionId ===
                          opt.id
                        }
                        onChange={() =>
                          setAnswers((a) => ({ ...a, [q.id]: { selectedOptionId: opt.id } }))
                        }
                      />
                      {opt.text}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "TRUE_FALSE" && (
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={q.id}
                      checked={(answers[q.id] as { value?: boolean })?.value === true}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: { value: true } }))}
                    />
                    Đúng
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={q.id}
                      checked={(answers[q.id] as { value?: boolean })?.value === false}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: { value: false } }))}
                    />
                    Sai
                  </label>
                </div>
              )}
              {q.type === "FILL_IN_BLANK" && (
                <input
                  value={(answers[q.id] as { text?: string })?.text ?? ""}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, [q.id]: { text: e.target.value } }))
                  }
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                />
              )}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-fit rounded-full bg-sky-600 px-8 py-3 text-base font-semibold text-white hover:bg-sky-700"
        >
          Nộp bài
        </button>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>
    );
  }

  if (phase === "submitted" && result) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Đã nộp bài!</h1>
        {result.showResults ? (
          <p className="text-lg text-zinc-700">
            Điểm của bạn: {result.score}/{result.maxScore}
          </p>
        ) : (
          <p className="text-zinc-500">Giáo viên sẽ công bố điểm sau.</p>
        )}
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-full border border-zinc-300 px-6 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  return null;
}
