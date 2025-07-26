"use client";

import { useEffect, useState } from "react";

import { useStore } from "@/hooks/useStore";

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const { userStore } = useStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (userStore.user === undefined) {
        await userStore.getCurrentUser();
      }
      setReady(true);
    };
    load();
  }, []);

  if (!ready) {
    console.warn("User is still loading...");
    return null; // or return a loading spinner
  }

  return <>{children}</>;
}