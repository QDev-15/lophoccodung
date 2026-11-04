/**
 * Seeds (idempotently) the public "thử trải nghiệm" sample quizzes shown on
 * /kho-hoc-lieu-so, under a dedicated system demo teacher/class.
 * Run with: npx tsx prisma/seed-samples.ts
 */
import { PrismaClient, type QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_TEACHER_EMAIL = "demo@lophoccodung.local";
const DEMO_CLASS_NAME = "Lớp mẫu - Kho học liệu số";

type SeedQuestion = {
  type: QuestionType;
  prompt: string;
  points: number;
  data: Record<string, unknown>;
};

type SeedQuiz = {
  token: string;
  title: string;
  description: string;
  questions: SeedQuestion[];
};

function mc(options: string[], correctIndex: number) {
  return {
    options: options.map((text, i) => ({ id: `opt-${i}`, text })),
    correctOptionId: `opt-${correctIndex}`,
  };
}

const SAMPLE_QUIZZES: SeedQuiz[] = [
  {
    token: "demo-toan-vui",
    title: "Toán vui: Cộng trừ trong phạm vi 100",
    description: "5 câu hỏi ôn phép cộng trừ cơ bản, phù hợp học sinh lớp 1-2.",
    questions: [
      { type: "MULTIPLE_CHOICE", prompt: "15 + 23 = ?", points: 1, data: mc(["38", "35", "48", "28"], 0) },
      { type: "TRUE_FALSE", prompt: "50 - 20 = 30", points: 1, data: { correctAnswer: true } },
      { type: "FILL_IN_BLANK", prompt: "9 + 9 = ___", points: 1, data: { acceptedAnswers: ["18"], caseSensitive: false } },
      { type: "MULTIPLE_CHOICE", prompt: "Số liền sau của 99 là?", points: 1, data: mc(["100", "98", "101", "90"], 0) },
      { type: "TRUE_FALSE", prompt: "100 là một số chẵn.", points: 1, data: { correctAnswer: true } },
    ],
  },
  {
    token: "demo-tieng-viet",
    title: "Tiếng Việt: Từ đồng nghĩa - trái nghĩa",
    description: "5 câu hỏi luyện từ đồng nghĩa và trái nghĩa, phù hợp học sinh lớp 2-3.",
    questions: [
      { type: "MULTIPLE_CHOICE", prompt: "Từ nào trái nghĩa với 'cao'?", points: 1, data: mc(["thấp", "to", "dài", "nhanh"], 0) },
      { type: "MULTIPLE_CHOICE", prompt: "Từ nào đồng nghĩa với 'chăm chỉ'?", points: 1, data: mc(["lười biếng", "siêng năng", "vui vẻ", "to lớn"], 1) },
      { type: "TRUE_FALSE", prompt: "'To' và 'lớn' là hai từ đồng nghĩa.", points: 1, data: { correctAnswer: true } },
      { type: "FILL_IN_BLANK", prompt: "Trái nghĩa của 'đẹp' là ___", points: 1, data: { acceptedAnswers: ["xấu"], caseSensitive: false } },
      { type: "TRUE_FALSE", prompt: "'Nhanh' và 'chậm' là hai từ đồng nghĩa.", points: 1, data: { correctAnswer: false } },
    ],
  },
  {
    token: "demo-dong-vat",
    title: "Khám phá thiên nhiên: Động vật quanh em",
    description: "5 câu hỏi kiến thức chung về động vật, phù hợp học sinh lớp 1-3.",
    questions: [
      { type: "MULTIPLE_CHOICE", prompt: "Con vật nào sống dưới nước?", points: 1, data: mc(["cá", "mèo", "gà", "chó"], 0) },
      { type: "TRUE_FALSE", prompt: "Chim có thể bay vì có cánh.", points: 1, data: { correctAnswer: true } },
      { type: "FILL_IN_BLANK", prompt: "Con vật được mệnh danh là 'chúa tể rừng xanh' là con ___", points: 1, data: { acceptedAnswers: ["sư tử"], caseSensitive: false } },
      { type: "MULTIPLE_CHOICE", prompt: "Loài nào đẻ trứng?", points: 1, data: mc(["gà", "chó", "mèo", "voi"], 0) },
      { type: "TRUE_FALSE", prompt: "Cá thở bằng phổi giống con người.", points: 1, data: { correctAnswer: false } },
    ],
  },
];

async function main() {
  const teacher = await prisma.user.upsert({
    where: { email: DEMO_TEACHER_EMAIL },
    update: {},
    create: { email: DEMO_TEACHER_EMAIL, name: "Kho học liệu số" },
  });

  const klass = await prisma.class.upsert({
    where: { id: `demo-class-${teacher.id}` },
    update: {},
    create: { id: `demo-class-${teacher.id}`, name: DEMO_CLASS_NAME, teacherId: teacher.id },
  });

  for (const seedQuiz of SAMPLE_QUIZZES) {
    const existingAssignment = await prisma.assignment.findUnique({
      where: { token: seedQuiz.token },
    });

    const quiz = await prisma.quiz.upsert({
      where: { id: existingAssignment?.quizId ?? `demo-quiz-${seedQuiz.token}` },
      update: { title: seedQuiz.title, description: seedQuiz.description },
      create: {
        id: `demo-quiz-${seedQuiz.token}`,
        title: seedQuiz.title,
        description: seedQuiz.description,
        teacherId: teacher.id,
      },
    });

    await prisma.question.deleteMany({ where: { quizId: quiz.id } });
    await prisma.question.createMany({
      data: seedQuiz.questions.map((q, order) => ({
        quizId: quiz.id,
        order,
        type: q.type,
        prompt: q.prompt,
        points: q.points,
        data: q.data as never,
      })),
    });

    await prisma.assignment.upsert({
      where: { token: seedQuiz.token },
      update: { isActive: true, isPublicSample: true },
      create: {
        token: seedQuiz.token,
        quizId: quiz.id,
        classId: klass.id,
        createdById: teacher.id,
        showResultsToStudent: true,
        allowMultipleSubmissions: true,
        isActive: true,
        isPublicSample: true,
      },
    });

    console.log(`Seeded: ${seedQuiz.title} (/take/${seedQuiz.token})`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
