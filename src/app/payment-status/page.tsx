"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CircularProgress from "@mui/material/CircularProgress";
import { observer } from "mobx-react";
import { useStore } from "@/hooks/useStore";

const PaymentStatusContent = () => {
  const {
    announcementStore: { updateAnnouncement, deleteAnnouncement },
  } = useStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Publishing your announcement...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (success === "true" && orderId) {
      uploadMedia(orderId);
    } else {
      deleteAnnouncementById(orderId as string);
      setTimeout(() => router.push("/create-announcement?failed=true"), 3000);
    }
  }, [success, orderId, router]);

  const deleteAnnouncementById = async (announcementId: string) => {
    await deleteAnnouncement(orderId as string);
  }

  const uploadMedia = async (announcementId: string) => {
    try {
      const storedData = JSON.parse(localStorage.getItem("announcementData") || "{}");

      if (!storedData || Object.keys(storedData).length === 0) {
        setStatusMessage("No announcement data found. Redirecting...");
        setTimeout(() => router.push("/"), 2000);
        return;
      }
      
      const { announcementId } = storedData;

      if (!announcementId) {
        throw new Error("Announcement ID missing.");
      }

      setStatusMessage("Activating your announcement...");

      await updateAnnouncement(announcementId as string, {
        status: "active",
      });

      setStatusMessage("Your announcement has been successfully activated!");
      
      // ✅ Clear stored data after successful upload
      localStorage.removeItem("announcementData");

      setTimeout(() => router.push("/"), 3000);
    } catch (error) {
      console.error("Error activating announcement:", error);
      setError("Error activating announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? (
        <>
          <CircularProgress size={50} />
          <p>{statusMessage}</p>
        </>
      ) : (
        <h1>{error ? "❌ Error occurred" : "🎉 Announcement Published!"}</h1>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

const PaymentStatus = () => {
  return (
    <Suspense fallback={<CircularProgress size={50} style={{ marginTop: "50px" }} />}>
      <PaymentStatusContent />
    </Suspense>
  );
};

export default observer(PaymentStatus);