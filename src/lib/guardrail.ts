import { guardrail } from "@/data/playground";

export interface GuardrailCheck {
  id: "vocabulary" | "complexity" | "safety" | "structure";
  title: string;
  ok: boolean;
  detail: string;
}

export interface GuardrailResult {
  score: number;
  passes: boolean;
  checks: GuardrailCheck[];
  fallbackWord: string;
}

function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const m = w.match(/[aeiouy]{1,2}/g);
  let n = m ? m.length : 1;
  if (/e$/.test(w) && n > 1) n--;
  return Math.max(1, n);
}

/** Simplified demo of the four-layer story guardrail, ported 1:1 from source. */
export function checkStory(targetRaw: string, text: string): GuardrailResult {
  const target = targetRaw
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  const words = text.toLowerCase().match(/[a-z']+/g) ?? [];
  const sentences = (text.match(/[.!?]+/g) ?? []).length || 1;

  const unknown = [...new Set(words.filter((w) => w !== target && !guardrail.known.includes(w)))];
  const syl = words.reduce((s, w) => s + syllables(w), 0);
  const fk = words.length ? 0.39 * (words.length / sentences) + 11.8 * (syl / words.length) - 15.59 : 0;
  const unsafe = [...new Set(words.filter((w) => guardrail.unsafe.includes(w)))];
  const reps = words.filter((w) => w === target).length;
  const lenOk = words.length <= guardrail.maxWords;

  const checks: GuardrailCheck[] = [
    {
      id: "vocabulary",
      title: "Vocabulary",
      ok: unknown.length === 0,
      detail:
        unknown.length === 0
          ? "Every word except the target is in the known-word list."
          : `Outside the list: ${unknown.slice(0, 6).join(", ")}`,
    },
    {
      id: "complexity",
      title: "Complexity",
      ok: fk < guardrail.maxGrade,
      detail: `Flesch-Kincaid grade ${fk.toFixed(1)}${fk < guardrail.maxGrade ? ", below the third-grade ceiling." : ", above the third-grade ceiling."}`,
    },
    {
      id: "safety",
      title: "Content safety",
      ok: unsafe.length === 0,
      detail: unsafe.length === 0 ? "Nothing scary, sad or violent." : `Flagged: ${unsafe.join(", ")}.`,
    },
    {
      id: "structure",
      title: "Structure",
      ok: reps >= guardrail.minTargetRepeats && lenOk,
      detail: `Target repeated ${reps} ${reps === 1 ? "time" : "times"}, ${words.length} words${lenOk ? " within the 40-word limit." : ", over the 40-word limit."}`,
    },
  ];

  const passed = checks.filter((c) => c.ok).length;
  const score = passed === 4 ? Math.min(100, 90 + Math.round((3 - fk) * 3)) : Math.round((passed / 4) * 100);
  return {
    score,
    passes: score >= guardrail.passScore,
    checks,
    fallbackWord: (target || "word").toUpperCase(),
  };
}
