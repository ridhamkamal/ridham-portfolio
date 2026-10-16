import { create } from "zustand";

export type Intensity = "subtle" | "balanced" | "cinematic";
export type Speed = 0.5 | 1 | 1.5;

export interface MotionSettings {
  enabled: boolean;
  intensity: Intensity;
  tilt: boolean;
  parallax: boolean;
  cursor: boolean;
  speed: Speed;
}

export const STORAGE_KEY = "rc-motion-v1";

export const DEFAULTS: MotionSettings = {
  enabled: true,
  intensity: "balanced",
  tilt: true,
  parallax: true,
  cursor: true,
  speed: 1,
};

/** Starting point when the OS asks for reduced motion and the user has not chosen. */
export const REDUCED_DEFAULTS: MotionSettings = {
  enabled: false,
  intensity: "subtle",
  tilt: false,
  parallax: false,
  cursor: false,
  speed: 1,
};

export const INTENSITY_SCALE: Record<Intensity, number> = { subtle: 0.4, balanced: 1, cinematic: 1.6 };

interface MotionState extends MotionSettings {
  hydrated: boolean;
  systemReduced: boolean;
  /** True once the user has saved a choice; system preference no longer overrides it. */
  userChosen: boolean;
  panelOpen: boolean;
  set: (patch: Partial<MotionSettings>) => void;
  reset: () => void;
  hydrate: (systemReduced: boolean) => void;
  setPanelOpen: (open: boolean) => void;
}

export function readStored(): MotionSettings | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<MotionSettings>;
    return sanitize(v);
  } catch {
    return null;
  }
}

export function sanitize(v: Partial<MotionSettings>): MotionSettings {
  const intensity: Intensity =
    v.intensity === "subtle" || v.intensity === "cinematic" || v.intensity === "balanced"
      ? v.intensity
      : DEFAULTS.intensity;
  const speed: Speed = v.speed === 0.5 || v.speed === 1.5 || v.speed === 1 ? v.speed : DEFAULTS.speed;
  const bool = (x: unknown, d: boolean) => (typeof x === "boolean" ? x : d);
  return {
    enabled: bool(v.enabled, DEFAULTS.enabled),
    intensity,
    tilt: bool(v.tilt, DEFAULTS.tilt),
    parallax: bool(v.parallax, DEFAULTS.parallax),
    cursor: bool(v.cursor, DEFAULTS.cursor),
    speed,
  };
}

function write(s: MotionSettings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable: preferences last for this page view only */
  }
}

const pick = (s: MotionState): MotionSettings => ({
  enabled: s.enabled,
  intensity: s.intensity,
  tilt: s.tilt,
  parallax: s.parallax,
  cursor: s.cursor,
  speed: s.speed,
});

export const useMotionStore = create<MotionState>((set, get) => ({
  ...DEFAULTS,
  hydrated: false,
  systemReduced: false,
  userChosen: false,
  panelOpen: false,
  set: (patch) => {
    set({ ...patch, userChosen: true });
    write(pick(get()));
  },
  reset: () => {
    const base = get().systemReduced ? REDUCED_DEFAULTS : DEFAULTS;
    set({ ...base, userChosen: false });
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
  hydrate: (systemReduced) => {
    const stored = readStored();
    if (stored) set({ ...stored, systemReduced, userChosen: true, hydrated: true });
    else set({ ...(systemReduced ? REDUCED_DEFAULTS : DEFAULTS), systemReduced, hydrated: true });
  },
  setPanelOpen: (panelOpen) => set({ panelOpen }),
}));
