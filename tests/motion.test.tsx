import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEFAULTS, REDUCED_DEFAULTS, STORAGE_KEY, sanitize, useMotionStore } from "@/components/motion/store";
import { MotionPanel, openMotionPanel } from "@/components/motion/MotionPanel";

const reset = () =>
  useMotionStore.setState({
    ...DEFAULTS,
    hydrated: false,
    userChosen: false,
    systemReduced: false,
    panelOpen: false,
  });

describe("motion store", () => {
  it("starts with motion off when the OS asks for reduced motion and nothing is saved", () => {
    reset();
    useMotionStore.getState().hydrate(true);
    expect(useMotionStore.getState()).toMatchObject(REDUCED_DEFAULTS);
  });
  it("lets a saved choice override reduced motion", () => {
    reset();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULTS, intensity: "cinematic" }));
    useMotionStore.getState().hydrate(true);
    expect(useMotionStore.getState()).toMatchObject({
      enabled: true,
      intensity: "cinematic",
      userChosen: true,
    });
  });
  it("persists changes and resets to defaults", () => {
    reset();
    useMotionStore.getState().hydrate(false);
    useMotionStore.getState().set({ speed: 1.5, parallax: false });
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toMatchObject({
      speed: 1.5,
      parallax: false,
    });
    useMotionStore.getState().reset();
    expect(useMotionStore.getState()).toMatchObject(DEFAULTS);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
  it("sanitizes corrupt storage", () => {
    expect(sanitize({ intensity: "wild" as never, speed: 3 as never, tilt: "yes" as never })).toEqual(
      DEFAULTS,
    );
  });
});

describe("MotionPanel", () => {
  it("is a labelled dialog with switches and radio groups operable by keyboard", async () => {
    reset();
    useMotionStore.getState().hydrate(false);
    const user = userEvent.setup();
    render(<MotionPanel />);
    act(() => openMotionPanel());
    const dialog = await screen.findByRole("dialog", { name: "Motion controls" });
    expect(dialog).toBeInTheDocument();

    const motionSwitch = screen.getByRole("switch", { name: "Motion" });
    expect(motionSwitch).toHaveAttribute("aria-checked", "true");

    const balanced = screen.getByRole("radio", { name: "Balanced" });
    balanced.focus();
    await user.keyboard("{ArrowRight}");
    expect(useMotionStore.getState().intensity).toBe("cinematic");
    expect(screen.getByRole("radio", { name: "Cinematic" })).toHaveFocus();

    await user.click(motionSwitch);
    expect(useMotionStore.getState().enabled).toBe(false);
    expect(screen.getByRole("radio", { name: "Subtle" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Reset to defaults" }));
    expect(useMotionStore.getState().enabled).toBe(true);
    expect(screen.getByRole("status")).toHaveTextContent("restored to defaults");

    await user.keyboard("{Escape}");
    expect(useMotionStore.getState().panelOpen).toBe(false);
  });
});
