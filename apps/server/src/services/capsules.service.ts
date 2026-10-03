import type { Capsule, CapsuleStatus, CreateCapsuleInput } from "@repo/types";
import { prisma } from "../lib/prisma";
import { sendCapsuleEmail } from "./capsuleMailer.service";

function addTwoYears(date: Date): Date {
  const unlockAt = new Date(date);
  unlockAt.setFullYear(unlockAt.getFullYear() + 2);
  return unlockAt;
}

export async function createCapsule(input: CreateCapsuleInput): Promise<Capsule> {
  const created = await prisma.capsule.create({
    data: { ...input, unlockAt: addTwoYears(new Date()) },
  });

  return {
    ...input,
    id: created.id,
    unlockAt: created.unlockAt.toISOString(),
    status: "pending",
    createdAt: created.createdAt.toISOString(),
  };
}

async function processDueCapsules(): Promise<void> {
  const now = new Date();
  const dueCapsules = await prisma.capsule.findMany({
    where: {
      status: "PENDING",
      unlockAt: { lte: now },
      nextAttemptAt: { lte: now },
    },
    orderBy: { unlockAt: "asc" },
    take: 10,
  });

  for (const capsule of dueCapsules) {
    const claimed = await prisma.capsule.updateMany({
      where: { id: capsule.id, status: "PENDING" },
      data: { status: "SENDING", attempts: { increment: 1 } },
    });
    if (claimed.count === 0) continue;

    try {
      await sendCapsuleEmail(capsule);
      await prisma.capsule.update({
        where: { id: capsule.id },
        data: { status: "SENT", sentAt: new Date() },
      });
    } catch {
      const attempts = capsule.attempts + 1;
      const delayMinutes = Math.min(2 ** Math.min(attempts, 11), 1440);
      await prisma.capsule.update({
        where: { id: capsule.id },
        data: {
          status: "PENDING",
          nextAttemptAt: new Date(Date.now() + delayMinutes * 60_000),
        },
      });
      console.error(`Falha ao enviar cápsula ${capsule.id}; nova tentativa agendada.`);
    }
  }
}

export function startCapsuleScheduler(): void {
  const staleBefore = new Date(Date.now() - 30 * 60_000);
  const run = () => {
    void processDueCapsules().catch((error: unknown) => {
      console.error("Falha ao processar cápsulas agendadas:", error);
    });
  };

  void prisma.capsule
    .updateMany({
      where: { status: "SENDING", updatedAt: { lt: staleBefore } },
      data: { status: "PENDING" },
    })
    .then(run)
    .catch((error: unknown) => {
      console.error("Falha ao recuperar cápsulas pendentes:", error);
    });

  const timer = setInterval(run, 30_000);
  timer.unref();
}