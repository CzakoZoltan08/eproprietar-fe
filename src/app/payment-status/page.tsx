import PaymentStatus from "./PaymentStatus";
import { Suspense } from "react";

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div>Se încarcă statusul plății...</div>}>
      <PaymentStatus />
    </Suspense>
  );
}