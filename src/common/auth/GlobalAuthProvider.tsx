"use client";

import { useEffect } from "react";
import { useStore } from "@/hooks/useStore";

export default function GlobalAuthProvider({ children }: { children: React.ReactNode }) {
  const { userStore } = useStore();

  useEffect(() => {
    if (userStore.user === undefined) {
      userStore.getCurrentUser();
    }
  }, [userStore]);

  return <>{children}</>;
}