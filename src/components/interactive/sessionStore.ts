import { create } from "zustand";

/**
 * In-memory record of this visit's playground interactions, shown on the
 * dashboard's demo section. Never persisted, never sent anywhere.
 */
interface PlaygroundSession {
  /** decision index → option index the visitor picked */
  picks: Record<number, number>;
  pick: (decision: number, option: number) => void;
  guardrailRuns: number;
  countGuardrailRun: () => void;
  simulatorLast: { users: number; diyPct: number; familyPct: number; costToServe: number } | null;
  setSimulator: (v: PlaygroundSession["simulatorLast"]) => void;
}

export const usePlaygroundSession = create<PlaygroundSession>((set) => ({
  picks: {},
  pick: (d, o) => set((s) => ({ picks: { ...s.picks, [d]: o } })),
  guardrailRuns: 0,
  countGuardrailRun: () => set((s) => ({ guardrailRuns: s.guardrailRuns + 1 })),
  simulatorLast: null,
  setSimulator: (simulatorLast) => set({ simulatorLast }),
}));
