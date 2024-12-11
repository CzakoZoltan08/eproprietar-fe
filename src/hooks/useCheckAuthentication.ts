import React from "react";
import { StorageKeys } from "@/constants/storageKeys";
import { redirect } from "next/navigation";

const logout = () => {
  redirect("/login");
};

export function useCheckAuthentication(Component: React.ReactNode) {
  if (typeof window !== "undefined") {
    if (!localStorage.getItem(StorageKeys.token)) {
      logout();
      return null;
    }

    return Component;
  }
}
