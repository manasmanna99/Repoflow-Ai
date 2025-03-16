"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function UserButtonWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      <UserButton
        afterSignOutUrl="/sign-in"
        appearance={{
          elements: {
            rootBox: "relative",
            root: "relative",
          },
        }}
      />
    </div>
  );
}
