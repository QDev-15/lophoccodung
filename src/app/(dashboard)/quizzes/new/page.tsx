import { QuizEditor } from "../QuizEditor";

export default function NewQuizPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900">Tạo đề kiểm tra mới</h1>
      <div className="mt-6">
        <QuizEditor quizId={null} />
      </div>
    </div>
  );
}
