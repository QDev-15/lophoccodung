import { describe, expect, it } from "vitest";

import { gradeAnswer, gradeSubmission, stripAnswerKey } from "@/lib/grading";

const mcq = {
  id: "q1",
  type: "MULTIPLE_CHOICE" as const,
  points: 2,
  data: {
    options: [
      { id: "a", text: "Hà Nội" },
      { id: "b", text: "Huế" },
    ],
    correctOptionId: "a",
  },
};

const tf = {
  id: "q2",
  type: "TRUE_FALSE" as const,
  points: 1,
  data: { correctAnswer: true },
};

const fib = {
  id: "q3",
  type: "FILL_IN_BLANK" as const,
  points: 3,
  data: { acceptedAnswers: ["Hà Nội", "ha noi"], caseSensitive: false },
};

describe("gradeAnswer", () => {
  it("awards full points for a correct multiple choice answer", () => {
    const result = gradeAnswer(mcq, { selectedOptionId: "a" });
    expect(result.isCorrect).toBe(true);
    expect(result.pointsAwarded).toBe(2);
  });

  it("awards zero for an incorrect multiple choice answer", () => {
    const result = gradeAnswer(mcq, { selectedOptionId: "b" });
    expect(result.isCorrect).toBe(false);
    expect(result.pointsAwarded).toBe(0);
  });

  it("grades true/false correctly in both directions", () => {
    expect(gradeAnswer(tf, { value: true }).isCorrect).toBe(true);
    expect(gradeAnswer(tf, { value: false }).isCorrect).toBe(false);
  });

  it("matches fill-in-blank case-insensitively", () => {
    expect(gradeAnswer(fib, { text: "HÀ NỘI" }).isCorrect).toBe(true);
    expect(gradeAnswer(fib, { text: "ha noi" }).isCorrect).toBe(true);
    expect(gradeAnswer(fib, { text: "Đà Nẵng" }).isCorrect).toBe(false);
  });

  it("scores an unanswered question as incorrect", () => {
    const result = gradeAnswer(mcq, undefined);
    expect(result.isCorrect).toBe(false);
    expect(result.pointsAwarded).toBe(0);
  });
});

describe("gradeSubmission", () => {
  it("sums score and maxScore across mixed question types", () => {
    const { score, maxScore, answers } = gradeSubmission([mcq, tf, fib], {
      q1: { selectedOptionId: "a" },
      q2: { value: false },
      q3: { text: "Hà Nội" },
    });
    expect(maxScore).toBe(6);
    expect(score).toBe(5);
    expect(answers).toHaveLength(3);
  });
});

describe("stripAnswerKey", () => {
  it("removes the correct answer from multiple choice data", () => {
    const stripped = stripAnswerKey(mcq);
    expect(stripped.data).not.toHaveProperty("correctOptionId");
    expect((stripped.data as { options: unknown[] }).options).toHaveLength(2);
  });

  it("removes the correct answer from true/false data", () => {
    const stripped = stripAnswerKey(tf);
    expect(stripped.data).not.toHaveProperty("correctAnswer");
  });

  it("removes accepted answers from fill-in-blank data", () => {
    const stripped = stripAnswerKey(fib);
    expect(stripped.data).not.toHaveProperty("acceptedAnswers");
  });
});
