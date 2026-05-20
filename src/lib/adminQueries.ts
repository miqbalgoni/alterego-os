// Aggregation queries for the admin dashboard. Keep these server-only.
// Each function returns a plain JSON-serializable shape ready for the page.

import { prisma } from "./db";

const IRL_SECTIONS = [
  "irl-1", "irl-2", "irl-3", "irl-4", "irl-5",
  "irl-6", "irl-7", "irl-8", "irl-9",
] as const;

export const FUNNEL_STEPS = [
  "personal", "irl-1", "irl-2", "irl-3", "irl-4", "irl-5",
  "irl-6", "irl-7", "irl-8", "irl-9", "review", "submitted",
] as const;

export async function getOverviewStats() {
  const [totalUsers, adminUsers, submittedSessions, totalSessions, last7d] = await Promise.all([
    prisma.user.count({ where: { role: "FOUNDER" } }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "SUPERADMIN"] } } }),
    prisma.session.count({ where: { submitted: true } }),
    prisma.session.count(),
    prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  const [completedModules, startedModules] = await Promise.all([
    prisma.moduleProgress.count({ where: { status: "completed" } }),
    prisma.moduleProgress.count({ where: { status: "started" } }),
  ]);

  const docCount = await prisma.knowledgeDocument.count({ where: { status: "active" } });
  const chunkCount = await prisma.knowledgeChunk.count();

  return {
    totalUsers,
    adminUsers,
    submittedSessions,
    totalSessions,
    last7d,
    completedModules,
    startedModules,
    docCount,
    chunkCount,
    submissionRate: totalSessions === 0 ? 0 : Math.round((submittedSessions / totalSessions) * 100),
  };
}

/**
 * Funnel: count of founders who reached each step. A user is considered to have
 * reached step X if their session.currentStep is X OR a later step.
 */
export async function getFunnel() {
  // Group sessions by currentStep
  const groups = await prisma.session.groupBy({
    by: ["currentStep"],
    _count: { _all: true },
  });
  const byStep = new Map<string, number>();
  for (const g of groups) byStep.set(g.currentStep, g._count._all);

  // For each step, count users whose step is >= step
  const steps = FUNNEL_STEPS;
  let runningSum = 0;
  // Iterate backwards: each step's "reached" = sum of itself and later steps
  const reached = new Map<string, number>();
  for (let i = steps.length - 1; i >= 0; i--) {
    runningSum += byStep.get(steps[i]) ?? 0;
    reached.set(steps[i], runningSum);
  }
  const total = reached.get(steps[0]) ?? 0;
  return steps.map(step => ({
    step,
    count: reached.get(step) ?? 0,
    pct: total === 0 ? 0 : Math.round(((reached.get(step) ?? 0) / total) * 100),
  }));
}

/**
 * Average + distribution of IRL scores per section, latest assessment per user.
 */
export async function getScoreDistribution() {
  // Pull latest assessment per (user, section). We do this in JS for clarity —
  // dataset will stay small (≤ few thousand assessments) for the foreseeable future.
  const all = await prisma.irlAssessment.findMany({
    select: { userId: true, section: true, score: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  const latest = new Map<string, number>(); // key = userId|section
  for (const a of all) {
    const k = `${a.userId}|${a.section}`;
    if (!latest.has(k)) latest.set(k, a.score);
  }
  const bySection: Record<string, number[]> = {};
  for (const section of IRL_SECTIONS) bySection[section] = [];
  for (const [k, score] of latest) {
    const section = k.split("|")[1];
    if (bySection[section]) bySection[section].push(score);
  }
  return IRL_SECTIONS.map(section => {
    const scores = bySection[section];
    const n = scores.length;
    const avg = n === 0 ? 0 : Math.round(scores.reduce((s, x) => s + x, 0) / n);
    const buckets = [0, 0, 0, 0, 0]; // 0-19, 20-39, 40-59, 60-79, 80-100
    for (const s of scores) {
      const idx = Math.min(4, Math.floor(s / 20));
      buckets[idx]++;
    }
    return { section, count: n, avg, buckets };
  });
}

/**
 * Top gap tags across all latest assessments.
 */
export async function getTopGapTags(limit = 12) {
  const all = await prisma.irlAssessment.findMany({
    select: { userId: true, section: true, gapTags: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  const seen = new Set<string>();
  const counts = new Map<string, number>();
  for (const a of all) {
    const k = `${a.userId}|${a.section}`;
    if (seen.has(k)) continue;
    seen.add(k);
    try {
      const tags = JSON.parse(a.gapTags) as string[];
      if (Array.isArray(tags)) {
        for (const t of tags) counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    } catch {
      // ignore malformed
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

export async function getRecentActivity(limit = 12) {
  const [signups, submissions, assessments] = await Promise.all([
    prisma.user.findMany({
      where: { role: "FOUNDER" },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, email: true, fullName: true, createdAt: true },
    }),
    prisma.session.findMany({
      where: { submitted: true },
      orderBy: { submittedAt: "desc" },
      take: limit,
      select: {
        userId: true,
        submittedAt: true,
        user: { select: { email: true, fullName: true } },
      },
    }),
    prisma.irlAssessment.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        userId: true,
        section: true,
        score: true,
        createdAt: true,
        user: { select: { email: true, fullName: true } },
      },
    }),
  ]);
  return { signups, submissions, assessments };
}

export { IRL_SECTIONS };
