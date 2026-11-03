"use client";

import { useId, useState } from "react";

import { saveQuiz } from "./actions";

type MultipleChoiceData = { options: { id: string; text: string }[]; correctOptionId: string };
type TrueFalseData = { correctAnswer: boolean };
type FillInBlankData = { acceptedAnswers: string[]; caseSensitive: boolean };

type EditableQuestion = {
  key: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
  prompt: string;
  points: number;
  data: MultipleChoiceData | TrueFalseData | FillInBlankData;
};

export type InitialQuiz = {
  title: string;
  description: string;
  timeLimitMinutes: number | null;
  shuffleQuestions: boolean;
  questions: EditableQuestion[];
};

function newMultipleChoice(key: string): EditableQuestion {
  return {
    key,
    type: "MULTIPLE_CHOICE",
    prompt: "",
    points: 1,
    data: {
      options: [
        { id: `${key}-a`, text: "" },
        { id: `${key}-b`, text: "" },
      ],
      correctOptionId: `${key}-a`,
    },
  };
}

function newTrueFalse(key: string): EditableQuestion {
  return { key, type: "TRUE_FALSE", prompt: "", points: 1, data: { correctAnswer: true } };
}

function newFillInBlank(key: string): EditableQuestion {
  return {
    key,
    type: "FILL_IN_BLANK",
    prompt: "",
    points: 1,
    data: { acceptedAnswers: [""], caseSensitive: false },
  };
}

export function QuizEditor({
  quizId,
  initial,
}: {
  quizId: string | null;
  initial?: InitialQuiz;
}) {
  const uid = useId();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<string>(
    initial?.timeLimitMinutes != null ? String(initial.timeLimitMinutes) : "",
  );
  const [shuffleQuestions, setShuffleQuestions] = useState(initial?.shuffleQuestions ?? false);
  const [questions, setQuestions] = useState<EditableQuestion[]>(initial?.questions ?? []);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addQuestion(type: EditableQuestion["type"]) {
    const key = `${uid}-${questions.length}-${Date.now()}`;
    const q =
      type === "MULTIPLE_CHOICE"
        ? newMultipleChoice(key)
        : type === "TRUE_FALSE"
          ? newTrueFalse(key)
          : newFillInBlank(key);
    setQuestions((qs) => [...qs, q]);
  }

  function updateQuestion(index: number, patch: Partial<EditableQuestion>) {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function removeQuestion(index: number) {
    setQuestions((qs) => qs.filter((_, i) => i !== index));
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    setQuestions((qs) => {
      const next = [...qs];
      const target = index + direction;
      if (target < 0 || target >= next.length) return qs;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleSave() {
    setError(null);
    setIsSaving(true);
    try {
      await saveQuiz(quizId, {
        title,
        description,
        timeLimitSeconds: timeLimitMinutes ? Number(timeLimitMinutes) * 60 : null,
        shuffleQuestions,
        questions: questions.map((q) => ({
          type: q.type,
          prompt: q.prompt,
          points: q.points,
          data: q.data,
        })) as never,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-700">Tên đề kiểm tra</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-700">Mô tả (không bắt buộc)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
          />
        </label>
        <div className="flex items-center gap-6">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Thời gian làm bài (phút)</span>
            <input
              type="number"
              min={1}
              placeholder="Không giới hạn"
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(e.target.value)}
              className="w-40 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={shuffleQuestions}
              onChange={(e) => setShuffleQuestions(e.target.checked)}
            />
            Xáo trộn thứ tự câu hỏi
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q, index) => (
          <QuestionCard
            key={q.key}
            index={index}
            total={questions.length}
            question={q}
            onChange={(patch) => updateQuestion(index, patch)}
            onRemove={() => removeQuestion(index)}
            onMove={(dir) => moveQuestion(index, dir)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => addQuestion("MULTIPLE_CHOICE")}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          + Trắc nghiệm
        </button>
        <button
          onClick={() => addQuestion("TRUE_FALSE")}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          + Đúng/Sai
        </button>
        <button
          onClick={() => addQuestion("FILL_IN_BLANK")}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          + Điền từ
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleSave}
        disabled={isSaving || !title || questions.length === 0}
        className="w-fit rounded-full bg-sky-600 px-6 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
      >
        {isSaving ? "Đang lưu..." : "Lưu đề kiểm tra"}
      </button>
    </div>
  );
}

function QuestionCard({
  index,
  total,
  question,
  onChange,
  onRemove,
  onMove,
}: {
  index: number;
  total: number;
  question: EditableQuestion;
  onChange: (patch: Partial<EditableQuestion>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500">
          Câu {index + 1} ·{" "}
          {question.type === "MULTIPLE_CHOICE"
            ? "Trắc nghiệm"
            : question.type === "TRUE_FALSE"
              ? "Đúng/Sai"
              : "Điền từ"}
        </span>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => onMove(-1)} disabled={index === 0} className="disabled:opacity-30">
            ↑
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="disabled:opacity-30"
          >
            ↓
          </button>
          <label className="flex items-center gap-1 text-zinc-500">
            Điểm
            <input
              type="number"
              min={1}
              value={question.points}
              onChange={(e) => onChange({ points: Number(e.target.value) || 1 })}
              className="w-14 rounded border border-zinc-300 px-1 py-0.5"
            />
          </label>
          <button onClick={onRemove} className="text-zinc-400 hover:text-red-600">
            Xóa
          </button>
        </div>
      </div>

      <textarea
        value={question.prompt}
        onChange={(e) => onChange({ prompt: e.target.value })}
        placeholder="Nhập câu hỏi"
        rows={2}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
      />

      {question.type === "MULTIPLE_CHOICE" && (
        <MultipleChoiceEditor
          data={question.data as MultipleChoiceData}
          onChange={(data) => onChange({ data })}
        />
      )}
      {question.type === "TRUE_FALSE" && (
        <TrueFalseEditor
          data={question.data as TrueFalseData}
          onChange={(data) => onChange({ data })}
        />
      )}
      {question.type === "FILL_IN_BLANK" && (
        <FillInBlankEditor
          data={question.data as FillInBlankData}
          onChange={(data) => onChange({ data })}
        />
      )}
    </div>
  );
}

function MultipleChoiceEditor({
  data,
  onChange,
}: {
  data: MultipleChoiceData;
  onChange: (data: MultipleChoiceData) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {data.options.map((opt, i) => (
        <div key={opt.id} className="flex items-center gap-2">
          <input
            type="radio"
            checked={data.correctOptionId === opt.id}
            onChange={() => onChange({ ...data, correctOptionId: opt.id })}
          />
          <input
            value={opt.text}
            onChange={(e) => {
              const options = data.options.map((o, idx) =>
                idx === i ? { ...o, text: e.target.value } : o,
              );
              onChange({ ...data, options });
            }}
            placeholder={`Lựa chọn ${i + 1}`}
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
          />
          {data.options.length > 2 && (
            <button
              onClick={() => {
                const options = data.options.filter((_, idx) => idx !== i);
                const correctOptionId =
                  data.correctOptionId === opt.id ? options[0]?.id : data.correctOptionId;
                onChange({ options, correctOptionId });
              }}
              className="text-xs text-zinc-400 hover:text-red-600"
            >
              Xóa
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => {
          const newId = `opt-${Date.now()}`;
          onChange({ ...data, options: [...data.options, { id: newId, text: "" }] });
        }}
        className="w-fit text-sm text-sky-600 hover:underline"
      >
        + Thêm lựa chọn
      </button>
    </div>
  );
}

function TrueFalseEditor({
  data,
  onChange,
}: {
  data: TrueFalseData;
  onChange: (data: TrueFalseData) => void;
}) {
  return (
    <div className="flex gap-4 text-sm">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          checked={data.correctAnswer === true}
          onChange={() => onChange({ correctAnswer: true })}
        />
        Đúng
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          checked={data.correctAnswer === false}
          onChange={() => onChange({ correctAnswer: false })}
        />
        Sai
      </label>
    </div>
  );
}

function FillInBlankEditor({
  data,
  onChange,
}: {
  data: FillInBlankData;
  onChange: (data: FillInBlankData) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1">
        <span className="text-xs text-zinc-500">
          Các đáp án được chấp nhận, cách nhau bởi dấu phẩy
        </span>
        <input
          value={data.acceptedAnswers.join(", ")}
          onChange={(e) =>
            onChange({
              ...data,
              acceptedAnswers: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={data.caseSensitive}
          onChange={(e) => onChange({ ...data, caseSensitive: e.target.checked })}
        />
        Phân biệt hoa/thường
      </label>
    </div>
  );
}
