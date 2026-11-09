import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/require-teacher";

export default async function DashboardMiniGameRedirect() {
  const teacher = await requireTeacher();

  const latestClass = await prisma.class.findFirst({
    where: { teacherId: teacher.id! },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  redirect(latestClass ? `/classes/${latestClass.id}/games` : "/classes/new");
}
