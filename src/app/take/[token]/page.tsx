import { TakeQuizClient } from "./TakeQuizClient";

export default async function TakeQuizPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <TakeQuizClient token={token} />
    </div>
  );
}
