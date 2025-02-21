"use client";

import { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/useStore";

const AdminLayout = observer(({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const {
    userStore: { user, getCurrentUser },
  } = useStore();
  const [loading, setLoading] = useState(true); // <-- Loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user?.id) {
          await getCurrentUser(); // <-- Wait for user to be fetched
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false); // <-- Only stop loading after getCurrentUser finishes
      }
    };

    fetchUser();
  }, [user, getCurrentUser]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/"); // Redirect after loading and user check
    }
  }, [user, loading, router]);

  // Render null while loading
  if (loading) {
    return null;
  }

  // Render children if user is admin
  return user?.role === "admin" ? <>{children}</> : null;
});

export default AdminLayout;