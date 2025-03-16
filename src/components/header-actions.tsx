"use client";

import { ThemeToggle } from "~/components/theme-toggle";
import { UserButtonWrapper } from "~/components/user-button-wrapper";

export function HeaderActions() {
  return (
    <div className="ml-auto flex items-center gap-2">
      <ThemeToggle />
      <UserButtonWrapper />
    </div>
  );
}
