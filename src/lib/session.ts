// Session persistence helpers. We identify users by email alone — no password.
// Resume-by-email: look up user, read their answers, return earliest unanswered section.

import { prisma } from "./db";
import { ALL_QUESTIONS, SECTIONS, QUESTION_BY_ID, getSection } from "./questions";

export interface ResumeState {
  userId: string;
  email: string;
  answersByQuestion: Record<string, unknown>;
  currentStep: string;     // section id to land on
  submitted: boolean;
}

export async function findUserOrThrow(email: string) {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) throw new Error("User not found — sign up first.");
  return user;
}

export async function loadResumeState(email: string): Promise<ResumeState> {
  const user = await findUserOrThrow(email);
  const answers = await prisma.answer.findMany({ where: { userId: user.id } });
  const session =
    (await prisma.session.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    })) ?? (await prisma.session.create({ data: { userId: user.id } }));

  const answersByQuestion: Record<string, unknown> = {};
  for (const a of answers) {
    try { answersByQuestion[a.questionId] = JSON.parse(a.value); }
    catch { answersByQuestion[a.questionId] = a.value; }
  }

  // Compute earliest section with missing required answers
  let currentStep = session.currentStep;
  if (!session.submitted) {
    currentStep = earliestIncompleteSection(answersByQuestion) ?? "review";
  } else {
    currentStep = "submitted";
  }

  return {
    userId: user.id,
    email: user.email,
    answersByQuestion,
    currentStep,
    submitted: session.submitted,
  };
}

export function earliestIncompleteSection(
  answers: Record<string, unknown>
): string | null {
  for (const section of SECTIONS) {
    for (const qid of section.questionIds) {
      const q = QUESTION_BY_ID[qid];
      if (!q?.required) continue;
      if (!isAnswered(answers[qid], q.type)) return section.id;
    }
  }
  return null;
}

export function isAnswered(value: unknown, type: string): boolean {
  if (value === undefined || value === null) return false;
  if (type === "multi") return Array.isArray(value) && value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  return true;
}

export async function upsertAnswer(
  userId: string,
  questionId: string,
  value: unknown
) {
  const serialized = JSON.stringify(value ?? null);
  await prisma.answer.upsert({
    where: { userId_questionId: { userId, questionId } },
    create: { userId, questionId, value: serialized },
    update: { value: serialized },
  });
}

export async function updateSessionStep(userId: string, step: string) {
  const session = await prisma.session.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  if (session) {
    await prisma.session.update({
      where: { id: session.id },
      data: { currentStep: step },
    });
  }
}

export async function markSubmitted(userId: string) {
  const session = await prisma.session.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  if (session) {
    await prisma.session.update({
      where: { id: session.id },
      data: { submitted: true, submittedAt: new Date(), currentStep: "submitted" },
    });
  }
}

// Validate that a section's required questions are answered
export function sectionComplete(
  sectionId: string,
  answers: Record<string, unknown>
): { ok: boolean; missing: string[] } {
  const section = getSection(sectionId);
  if (!section) return { ok: false, missing: [] };
  const missing: string[] = [];
  for (const qid of section.questionIds) {
    const q = QUESTION_BY_ID[qid];
    if (!q?.required) continue;
    if (!isAnswered(answers[qid], q.type)) missing.push(qid);
  }
  return { ok: missing.length === 0, missing };
}

export { ALL_QUESTIONS };
