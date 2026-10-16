import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { DecisionExplorer } from "@/components/interactive/DecisionExplorer";
import { usePlaygroundSession } from "@/components/interactive/sessionStore";

describe("CopyEmail", () => {
  it("copies the address and announces it", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<CopyEmail email="ridhambatra15@gmail.com" />);
    await user.click(screen.getByRole("button", { name: /copy email/i }));
    expect(writeText).toHaveBeenCalledWith("ridhambatra15@gmail.com");
    expect(await screen.findByText("Email address copied to clipboard")).toBeInTheDocument();
  });
});

describe("DecisionExplorer", () => {
  it("requires a pick before revealing the documented decision", async () => {
    const user = userEvent.setup();
    render(<DecisionExplorer />);
    const reveal = screen.getByRole("button", { name: /pick an option/i });
    expect(reveal).toBeDisabled();
    await user.click(screen.getByRole("radio", { name: "Own post-failure order resolution" }));
    await user.click(screen.getByRole("button", { name: /reveal what i chose/i }));
    expect(await screen.findByText("You picked the same one.")).toBeInTheDocument();
    expect(usePlaygroundSession.getState().picks[0]).toBe(3);
  });
});
